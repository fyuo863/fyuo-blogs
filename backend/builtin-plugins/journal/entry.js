//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, a) => (a = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n));
//#endregion
//#region src/view-events.js
function u(e, { now: t = Date.now, random: n = () => crypto.randomUUID().replaceAll("-", ""), sleep: r = (e) => new Promise((t) => setTimeout(t, e)) } = {}) {
	let i = null;
	return { select(a, o, s) {
		if (!a) return i = null, null;
		if (i?.articleId === a) return i.promise;
		let c = `${t()}-${n()}`, l = (async () => {
			for (let t = 0; t < 3; t++) try {
				return await e(a, o, s, c);
			} catch (e) {
				let n = e.response?.status;
				if (t === 2 || n && n !== 429 && n < 500) throw e;
				await r(500 * 2 ** t);
			}
		})();
		return i = {
			articleId: a,
			promise: l
		}, l;
	} };
}
//#endregion
//#region \0blog-host:react
var d = globalThis.__FYUO_PLUGIN_HOST_V1__?.react;
if (!d) throw Error("Plugin requires blog host API v1");
d.default, d.Activity, d.Children, d.Component, d.Fragment, d.Profiler, d.PureComponent, d.StrictMode, d.Suspense, d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, d.__COMPILER_RUNTIME, d.act, d.cache, d.cacheSignal, d.captureOwnerStack, d.cloneElement, d.createContext, d.createElement, d.createRef, d.forwardRef, d.isValidElement, d.lazy, d.memo, d.startTransition, d.unstable_useCacheRefresh, d.use, d.useActionState;
var f = d.useCallback;
d.useContext, d.useDebugValue, d.useDeferredValue;
var p = d.useEffect;
d.useEffectEvent, d.useId, d.useImperativeHandle, d.useInsertionEffect;
var m = d.useLayoutEffect, h = d.useMemo;
d.useOptimistic, d.useReducer;
var g = d.useRef, _ = d.useState;
d.useSyncExternalStore, d.useTransition, d.version;
//#endregion
//#region \0blog-host:react-dom
var v = globalThis.__FYUO_PLUGIN_HOST_V1__?.["react-dom"];
if (!v) throw Error("Plugin requires blog host API v1");
v.default, v.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
var y = v.createPortal;
v.flushSync, v.preconnect, v.prefetchDNS, v.preinit, v.preinitModule, v.preload, v.preloadModule, v.requestFormReset, v.unstable_batchedUpdates, v.useFormState, v.useFormStatus, v.version;
//#endregion
//#region \0blog-host:react-router-dom
var b = globalThis.__FYUO_PLUGIN_HOST_V1__?.["react-router-dom"];
if (!b) throw Error("Plugin requires blog host API v1");
b.default, b.Await, b.BrowserRouter, b.Form, b.HashRouter, b.HydratedRouter, b.IDLE_BLOCKER, b.IDLE_FETCHER, b.IDLE_NAVIGATION, b.Link, b.Links, b.MemoryRouter, b.Meta, b.NavLink, b.Navigate, b.NavigationType, b.Outlet, b.PrefetchPageLinks, b.Route, b.Router, b.RouterContextProvider, b.RouterProvider, b.Routes, b.Scripts, b.ScrollRestoration, b.ServerRouter, b.StaticRouter, b.StaticRouterProvider, b.UNSAFE_AwaitContextProvider, b.UNSAFE_DataRouterContext, b.UNSAFE_DataRouterStateContext, b.UNSAFE_ErrorResponseImpl, b.UNSAFE_FetchersContext, b.UNSAFE_FrameworkContext, b.UNSAFE_LocationContext, b.UNSAFE_NavigationContext, b.UNSAFE_RSCDefaultRootErrorBoundary, b.UNSAFE_RemixErrorBoundary, b.UNSAFE_RouteContext, b.UNSAFE_ServerMode, b.UNSAFE_SingleFetchRedirectSymbol, b.UNSAFE_ViewTransitionContext, b.UNSAFE_WithComponentProps, b.UNSAFE_WithErrorBoundaryProps, b.UNSAFE_WithHydrateFallbackProps, b.UNSAFE_createBrowserHistory, b.UNSAFE_createClientRoutes, b.UNSAFE_createClientRoutesWithHMRRevalidationOptOut, b.UNSAFE_createHashHistory, b.UNSAFE_createMemoryHistory, b.UNSAFE_createRouter, b.UNSAFE_decodeViaTurboStream, b.UNSAFE_deserializeErrors, b.UNSAFE_getHydrationData, b.UNSAFE_getPatchRoutesOnNavigationFunction, b.UNSAFE_getTurboStreamSingleFetchDataStrategy, b.UNSAFE_hydrationRouteProperties, b.UNSAFE_invariant, b.UNSAFE_mapRouteProperties, b.UNSAFE_shouldHydrateRouteLoader, b.UNSAFE_useFogOFWarDiscovery, b.UNSAFE_useScrollRestoration, b.UNSAFE_withComponentProps, b.UNSAFE_withErrorBoundaryProps, b.UNSAFE_withHydrateFallbackProps, b.createBrowserRouter, b.createContext, b.createCookie, b.createCookieSessionStorage, b.createHashRouter, b.createMemoryRouter, b.createMemorySessionStorage, b.createPath, b.createRequestHandler, b.createRoutesFromChildren, b.createRoutesFromElements, b.createRoutesStub, b.createSearchParams, b.createSession, b.createSessionStorage, b.createStaticHandler, b.createStaticRouter, b.data, b.generatePath, b.href, b.isCookie, b.isRouteErrorResponse, b.isSession, b.matchPath, b.matchRoutes, b.parsePath, b.redirect, b.redirectDocument, b.renderMatches, b.replace, b.resolvePath, b.unstable_HistoryRouter, b.unstable_RSCStaticRouter, b.unstable_routeRSCServerRequest, b.unstable_setDevServerHooks, b.unstable_usePrompt, b.unstable_useRoute, b.unstable_useRouterState, b.useActionData, b.useAsyncError, b.useAsyncValue, b.useBeforeUnload, b.useBlocker, b.useFetcher, b.useFetchers, b.useFormAction, b.useHref, b.useInRouterContext, b.useLinkClickHandler, b.useLoaderData;
var x = b.useLocation;
b.useMatch, b.useMatches;
var S = b.useNavigate;
b.useNavigation, b.useNavigationType, b.useOutlet, b.useOutletContext, b.useParams, b.useResolvedPath, b.useRevalidator, b.useRouteError, b.useRouteLoaderData, b.useRoutes, b.useSearchParams, b.useSubmit, b.useViewTransitionState;
//#endregion
//#region node_modules/comma-separated-tokens/index.js
function C(e, t) {
	let n = t || {};
	return (e[e.length - 1] === "" ? [...e, ""] : e).join((n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")).trim();
}
//#endregion
//#region node_modules/estree-util-is-identifier-name/lib/index.js
var w = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, T = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, E = {};
function D(e, t) {
	return ((t || E).jsx ? T : w).test(e);
}
//#endregion
//#region node_modules/hast-util-whitespace/lib/index.js
var O = /[ \t\n\f\r]/g;
function k(e) {
	return typeof e == "object" ? e.type === "text" ? ee(e.value) : !1 : ee(e);
}
function ee(e) {
	return e.replace(O, "") === "";
}
//#endregion
//#region node_modules/property-information/lib/util/schema.js
var A = class {
	constructor(e, t, n) {
		this.normal = t, this.property = e, n && (this.space = n);
	}
};
A.prototype.normal = {}, A.prototype.property = {}, A.prototype.space = void 0;
//#endregion
//#region node_modules/property-information/lib/util/merge.js
function te(e, t) {
	let n = {}, r = {};
	for (let t of e) Object.assign(n, t.property), Object.assign(r, t.normal);
	return new A(n, r, t);
}
//#endregion
//#region node_modules/property-information/lib/normalize.js
function j(e) {
	return e.toLowerCase();
}
//#endregion
//#region node_modules/property-information/lib/util/info.js
var M = class {
	constructor(e, t) {
		this.attribute = t, this.property = e;
	}
};
M.prototype.attribute = "", M.prototype.booleanish = !1, M.prototype.boolean = !1, M.prototype.commaOrSpaceSeparated = !1, M.prototype.commaSeparated = !1, M.prototype.defined = !1, M.prototype.mustUseProperty = !1, M.prototype.number = !1, M.prototype.overloadedBoolean = !1, M.prototype.property = "", M.prototype.spaceSeparated = !1, M.prototype.space = void 0;
//#endregion
//#region node_modules/property-information/lib/util/types.js
var ne = /* @__PURE__ */ s({
	boolean: () => N,
	booleanish: () => P,
	commaOrSpaceSeparated: () => L,
	commaSeparated: () => ae,
	number: () => F,
	overloadedBoolean: () => ie,
	spaceSeparated: () => I
}), re = 0, N = oe(), P = oe(), ie = oe(), F = oe(), I = oe(), ae = oe(), L = oe();
function oe() {
	return 2 ** ++re;
}
//#endregion
//#region node_modules/property-information/lib/util/defined-info.js
var se = Object.keys(ne), ce = class extends M {
	constructor(e, t, n, r) {
		let i = -1;
		if (super(e, t), le(this, "space", r), typeof n == "number") for (; ++i < se.length;) {
			let e = se[i];
			le(this, se[i], (n & ne[e]) === ne[e]);
		}
	}
};
ce.prototype.defined = !0;
function le(e, t, n) {
	n && (e[t] = n);
}
//#endregion
//#region node_modules/property-information/lib/util/create.js
function ue(e) {
	let t = {}, n = {};
	for (let [r, i] of Object.entries(e.properties)) {
		let a = new ce(r, e.transform(e.attributes || {}, r), i, e.space);
		e.mustUseProperty && e.mustUseProperty.includes(r) && (a.mustUseProperty = !0), t[r] = a, n[j(r)] = r, n[j(a.attribute)] = r;
	}
	return new A(t, n, e.space);
}
//#endregion
//#region node_modules/property-information/lib/aria.js
var de = ue({
	properties: {
		ariaActiveDescendant: null,
		ariaAtomic: P,
		ariaAutoComplete: null,
		ariaBusy: P,
		ariaChecked: P,
		ariaColCount: F,
		ariaColIndex: F,
		ariaColSpan: F,
		ariaControls: I,
		ariaCurrent: null,
		ariaDescribedBy: I,
		ariaDetails: null,
		ariaDisabled: P,
		ariaDropEffect: I,
		ariaErrorMessage: null,
		ariaExpanded: P,
		ariaFlowTo: I,
		ariaGrabbed: P,
		ariaHasPopup: null,
		ariaHidden: P,
		ariaInvalid: null,
		ariaKeyShortcuts: null,
		ariaLabel: null,
		ariaLabelledBy: I,
		ariaLevel: F,
		ariaLive: null,
		ariaModal: P,
		ariaMultiLine: P,
		ariaMultiSelectable: P,
		ariaOrientation: null,
		ariaOwns: I,
		ariaPlaceholder: null,
		ariaPosInSet: F,
		ariaPressed: P,
		ariaReadOnly: P,
		ariaRelevant: null,
		ariaRequired: P,
		ariaRoleDescription: I,
		ariaRowCount: F,
		ariaRowIndex: F,
		ariaRowSpan: F,
		ariaSelected: P,
		ariaSetSize: F,
		ariaSort: null,
		ariaValueMax: F,
		ariaValueMin: F,
		ariaValueNow: F,
		ariaValueText: null,
		role: null
	},
	transform(e, t) {
		return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
	}
});
//#endregion
//#region node_modules/property-information/lib/util/case-sensitive-transform.js
function fe(e, t) {
	return t in e ? e[t] : t;
}
//#endregion
//#region node_modules/property-information/lib/util/case-insensitive-transform.js
function pe(e, t) {
	return fe(e, t.toLowerCase());
}
//#endregion
//#region node_modules/property-information/lib/html.js
var me = ue({
	attributes: {
		acceptcharset: "accept-charset",
		classname: "class",
		htmlfor: "for",
		httpequiv: "http-equiv"
	},
	mustUseProperty: [
		"checked",
		"multiple",
		"muted",
		"selected"
	],
	properties: {
		abbr: null,
		accept: ae,
		acceptCharset: I,
		accessKey: I,
		action: null,
		allow: null,
		allowFullScreen: N,
		allowPaymentRequest: N,
		allowUserMedia: N,
		alt: null,
		as: null,
		async: N,
		autoCapitalize: null,
		autoComplete: I,
		autoFocus: N,
		autoPlay: N,
		blocking: I,
		capture: null,
		charSet: null,
		checked: N,
		cite: null,
		className: I,
		cols: F,
		colSpan: null,
		content: null,
		contentEditable: P,
		controls: N,
		controlsList: I,
		coords: F | ae,
		crossOrigin: null,
		data: null,
		dateTime: null,
		decoding: null,
		default: N,
		defer: N,
		dir: null,
		dirName: null,
		disabled: N,
		download: ie,
		draggable: P,
		encType: null,
		enterKeyHint: null,
		fetchPriority: null,
		form: null,
		formAction: null,
		formEncType: null,
		formMethod: null,
		formNoValidate: N,
		formTarget: null,
		headers: I,
		height: F,
		hidden: ie,
		high: F,
		href: null,
		hrefLang: null,
		htmlFor: I,
		httpEquiv: I,
		id: null,
		imageSizes: null,
		imageSrcSet: null,
		inert: N,
		inputMode: null,
		integrity: null,
		is: null,
		isMap: N,
		itemId: null,
		itemProp: I,
		itemRef: I,
		itemScope: N,
		itemType: I,
		kind: null,
		label: null,
		lang: null,
		language: null,
		list: null,
		loading: null,
		loop: N,
		low: F,
		manifest: null,
		max: null,
		maxLength: F,
		media: null,
		method: null,
		min: null,
		minLength: F,
		multiple: N,
		muted: N,
		name: null,
		nonce: null,
		noModule: N,
		noValidate: N,
		onAbort: null,
		onAfterPrint: null,
		onAuxClick: null,
		onBeforeMatch: null,
		onBeforePrint: null,
		onBeforeToggle: null,
		onBeforeUnload: null,
		onBlur: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onContextLost: null,
		onContextMenu: null,
		onContextRestored: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFormData: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLanguageChange: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadEnd: null,
		onLoadStart: null,
		onMessage: null,
		onMessageError: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRejectionHandled: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onScrollEnd: null,
		onSecurityPolicyViolation: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onSlotChange: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnhandledRejection: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onWheel: null,
		open: N,
		optimum: F,
		pattern: null,
		ping: I,
		placeholder: null,
		playsInline: N,
		popover: null,
		popoverTarget: null,
		popoverTargetAction: null,
		poster: null,
		preload: null,
		readOnly: N,
		referrerPolicy: null,
		rel: I,
		required: N,
		reversed: N,
		rows: F,
		rowSpan: F,
		sandbox: I,
		scope: null,
		scoped: N,
		seamless: N,
		selected: N,
		shadowRootClonable: N,
		shadowRootDelegatesFocus: N,
		shadowRootMode: null,
		shape: null,
		size: F,
		sizes: null,
		slot: null,
		span: F,
		spellCheck: P,
		src: null,
		srcDoc: null,
		srcLang: null,
		srcSet: null,
		start: F,
		step: null,
		style: null,
		tabIndex: F,
		target: null,
		title: null,
		translate: null,
		type: null,
		typeMustMatch: N,
		useMap: null,
		value: P,
		width: F,
		wrap: null,
		writingSuggestions: null,
		align: null,
		aLink: null,
		archive: I,
		axis: null,
		background: null,
		bgColor: null,
		border: F,
		borderColor: null,
		bottomMargin: F,
		cellPadding: null,
		cellSpacing: null,
		char: null,
		charOff: null,
		classId: null,
		clear: null,
		code: null,
		codeBase: null,
		codeType: null,
		color: null,
		compact: N,
		declare: N,
		event: null,
		face: null,
		frame: null,
		frameBorder: null,
		hSpace: F,
		leftMargin: F,
		link: null,
		longDesc: null,
		lowSrc: null,
		marginHeight: F,
		marginWidth: F,
		noResize: N,
		noHref: N,
		noShade: N,
		noWrap: N,
		object: null,
		profile: null,
		prompt: null,
		rev: null,
		rightMargin: F,
		rules: null,
		scheme: null,
		scrolling: P,
		standby: null,
		summary: null,
		text: null,
		topMargin: F,
		valueType: null,
		version: null,
		vAlign: null,
		vLink: null,
		vSpace: F,
		allowTransparency: null,
		autoCorrect: null,
		autoSave: null,
		disablePictureInPicture: N,
		disableRemotePlayback: N,
		prefix: null,
		property: null,
		results: F,
		security: null,
		unselectable: null
	},
	space: "html",
	transform: pe
}), he = ue({
	attributes: {
		accentHeight: "accent-height",
		alignmentBaseline: "alignment-baseline",
		arabicForm: "arabic-form",
		baselineShift: "baseline-shift",
		capHeight: "cap-height",
		className: "class",
		clipPath: "clip-path",
		clipRule: "clip-rule",
		colorInterpolation: "color-interpolation",
		colorInterpolationFilters: "color-interpolation-filters",
		colorProfile: "color-profile",
		colorRendering: "color-rendering",
		crossOrigin: "crossorigin",
		dataType: "datatype",
		dominantBaseline: "dominant-baseline",
		enableBackground: "enable-background",
		fillOpacity: "fill-opacity",
		fillRule: "fill-rule",
		floodColor: "flood-color",
		floodOpacity: "flood-opacity",
		fontFamily: "font-family",
		fontSize: "font-size",
		fontSizeAdjust: "font-size-adjust",
		fontStretch: "font-stretch",
		fontStyle: "font-style",
		fontVariant: "font-variant",
		fontWeight: "font-weight",
		glyphName: "glyph-name",
		glyphOrientationHorizontal: "glyph-orientation-horizontal",
		glyphOrientationVertical: "glyph-orientation-vertical",
		hrefLang: "hreflang",
		horizAdvX: "horiz-adv-x",
		horizOriginX: "horiz-origin-x",
		horizOriginY: "horiz-origin-y",
		imageRendering: "image-rendering",
		letterSpacing: "letter-spacing",
		lightingColor: "lighting-color",
		markerEnd: "marker-end",
		markerMid: "marker-mid",
		markerStart: "marker-start",
		navDown: "nav-down",
		navDownLeft: "nav-down-left",
		navDownRight: "nav-down-right",
		navLeft: "nav-left",
		navNext: "nav-next",
		navPrev: "nav-prev",
		navRight: "nav-right",
		navUp: "nav-up",
		navUpLeft: "nav-up-left",
		navUpRight: "nav-up-right",
		onAbort: "onabort",
		onActivate: "onactivate",
		onAfterPrint: "onafterprint",
		onBeforePrint: "onbeforeprint",
		onBegin: "onbegin",
		onCancel: "oncancel",
		onCanPlay: "oncanplay",
		onCanPlayThrough: "oncanplaythrough",
		onChange: "onchange",
		onClick: "onclick",
		onClose: "onclose",
		onCopy: "oncopy",
		onCueChange: "oncuechange",
		onCut: "oncut",
		onDblClick: "ondblclick",
		onDrag: "ondrag",
		onDragEnd: "ondragend",
		onDragEnter: "ondragenter",
		onDragExit: "ondragexit",
		onDragLeave: "ondragleave",
		onDragOver: "ondragover",
		onDragStart: "ondragstart",
		onDrop: "ondrop",
		onDurationChange: "ondurationchange",
		onEmptied: "onemptied",
		onEnd: "onend",
		onEnded: "onended",
		onError: "onerror",
		onFocus: "onfocus",
		onFocusIn: "onfocusin",
		onFocusOut: "onfocusout",
		onHashChange: "onhashchange",
		onInput: "oninput",
		onInvalid: "oninvalid",
		onKeyDown: "onkeydown",
		onKeyPress: "onkeypress",
		onKeyUp: "onkeyup",
		onLoad: "onload",
		onLoadedData: "onloadeddata",
		onLoadedMetadata: "onloadedmetadata",
		onLoadStart: "onloadstart",
		onMessage: "onmessage",
		onMouseDown: "onmousedown",
		onMouseEnter: "onmouseenter",
		onMouseLeave: "onmouseleave",
		onMouseMove: "onmousemove",
		onMouseOut: "onmouseout",
		onMouseOver: "onmouseover",
		onMouseUp: "onmouseup",
		onMouseWheel: "onmousewheel",
		onOffline: "onoffline",
		onOnline: "ononline",
		onPageHide: "onpagehide",
		onPageShow: "onpageshow",
		onPaste: "onpaste",
		onPause: "onpause",
		onPlay: "onplay",
		onPlaying: "onplaying",
		onPopState: "onpopstate",
		onProgress: "onprogress",
		onRateChange: "onratechange",
		onRepeat: "onrepeat",
		onReset: "onreset",
		onResize: "onresize",
		onScroll: "onscroll",
		onSeeked: "onseeked",
		onSeeking: "onseeking",
		onSelect: "onselect",
		onShow: "onshow",
		onStalled: "onstalled",
		onStorage: "onstorage",
		onSubmit: "onsubmit",
		onSuspend: "onsuspend",
		onTimeUpdate: "ontimeupdate",
		onToggle: "ontoggle",
		onUnload: "onunload",
		onVolumeChange: "onvolumechange",
		onWaiting: "onwaiting",
		onZoom: "onzoom",
		overlinePosition: "overline-position",
		overlineThickness: "overline-thickness",
		paintOrder: "paint-order",
		panose1: "panose-1",
		pointerEvents: "pointer-events",
		referrerPolicy: "referrerpolicy",
		renderingIntent: "rendering-intent",
		shapeRendering: "shape-rendering",
		stopColor: "stop-color",
		stopOpacity: "stop-opacity",
		strikethroughPosition: "strikethrough-position",
		strikethroughThickness: "strikethrough-thickness",
		strokeDashArray: "stroke-dasharray",
		strokeDashOffset: "stroke-dashoffset",
		strokeLineCap: "stroke-linecap",
		strokeLineJoin: "stroke-linejoin",
		strokeMiterLimit: "stroke-miterlimit",
		strokeOpacity: "stroke-opacity",
		strokeWidth: "stroke-width",
		tabIndex: "tabindex",
		textAnchor: "text-anchor",
		textDecoration: "text-decoration",
		textRendering: "text-rendering",
		transformOrigin: "transform-origin",
		typeOf: "typeof",
		underlinePosition: "underline-position",
		underlineThickness: "underline-thickness",
		unicodeBidi: "unicode-bidi",
		unicodeRange: "unicode-range",
		unitsPerEm: "units-per-em",
		vAlphabetic: "v-alphabetic",
		vHanging: "v-hanging",
		vIdeographic: "v-ideographic",
		vMathematical: "v-mathematical",
		vectorEffect: "vector-effect",
		vertAdvY: "vert-adv-y",
		vertOriginX: "vert-origin-x",
		vertOriginY: "vert-origin-y",
		wordSpacing: "word-spacing",
		writingMode: "writing-mode",
		xHeight: "x-height",
		playbackOrder: "playbackorder",
		timelineBegin: "timelinebegin"
	},
	properties: {
		about: L,
		accentHeight: F,
		accumulate: null,
		additive: null,
		alignmentBaseline: null,
		alphabetic: F,
		amplitude: F,
		arabicForm: null,
		ascent: F,
		attributeName: null,
		attributeType: null,
		azimuth: F,
		bandwidth: null,
		baselineShift: null,
		baseFrequency: null,
		baseProfile: null,
		bbox: null,
		begin: null,
		bias: F,
		by: null,
		calcMode: null,
		capHeight: F,
		className: I,
		clip: null,
		clipPath: null,
		clipPathUnits: null,
		clipRule: null,
		color: null,
		colorInterpolation: null,
		colorInterpolationFilters: null,
		colorProfile: null,
		colorRendering: null,
		content: null,
		contentScriptType: null,
		contentStyleType: null,
		crossOrigin: null,
		cursor: null,
		cx: null,
		cy: null,
		d: null,
		dataType: null,
		defaultAction: null,
		descent: F,
		diffuseConstant: F,
		direction: null,
		display: null,
		dur: null,
		divisor: F,
		dominantBaseline: null,
		download: N,
		dx: null,
		dy: null,
		edgeMode: null,
		editable: null,
		elevation: F,
		enableBackground: null,
		end: null,
		event: null,
		exponent: F,
		externalResourcesRequired: null,
		fill: null,
		fillOpacity: F,
		fillRule: null,
		filter: null,
		filterRes: null,
		filterUnits: null,
		floodColor: null,
		floodOpacity: null,
		focusable: null,
		focusHighlight: null,
		fontFamily: null,
		fontSize: null,
		fontSizeAdjust: null,
		fontStretch: null,
		fontStyle: null,
		fontVariant: null,
		fontWeight: null,
		format: null,
		fr: null,
		from: null,
		fx: null,
		fy: null,
		g1: ae,
		g2: ae,
		glyphName: ae,
		glyphOrientationHorizontal: null,
		glyphOrientationVertical: null,
		glyphRef: null,
		gradientTransform: null,
		gradientUnits: null,
		handler: null,
		hanging: F,
		hatchContentUnits: null,
		hatchUnits: null,
		height: null,
		href: null,
		hrefLang: null,
		horizAdvX: F,
		horizOriginX: F,
		horizOriginY: F,
		id: null,
		ideographic: F,
		imageRendering: null,
		initialVisibility: null,
		in: null,
		in2: null,
		intercept: F,
		k: F,
		k1: F,
		k2: F,
		k3: F,
		k4: F,
		kernelMatrix: L,
		kernelUnitLength: null,
		keyPoints: null,
		keySplines: null,
		keyTimes: null,
		kerning: null,
		lang: null,
		lengthAdjust: null,
		letterSpacing: null,
		lightingColor: null,
		limitingConeAngle: F,
		local: null,
		markerEnd: null,
		markerMid: null,
		markerStart: null,
		markerHeight: null,
		markerUnits: null,
		markerWidth: null,
		mask: null,
		maskContentUnits: null,
		maskUnits: null,
		mathematical: null,
		max: null,
		media: null,
		mediaCharacterEncoding: null,
		mediaContentEncodings: null,
		mediaSize: F,
		mediaTime: null,
		method: null,
		min: null,
		mode: null,
		name: null,
		navDown: null,
		navDownLeft: null,
		navDownRight: null,
		navLeft: null,
		navNext: null,
		navPrev: null,
		navRight: null,
		navUp: null,
		navUpLeft: null,
		navUpRight: null,
		numOctaves: null,
		observer: null,
		offset: null,
		onAbort: null,
		onActivate: null,
		onAfterPrint: null,
		onBeforePrint: null,
		onBegin: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnd: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFocusIn: null,
		onFocusOut: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadStart: null,
		onMessage: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onMouseWheel: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRepeat: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onShow: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onZoom: null,
		opacity: null,
		operator: null,
		order: null,
		orient: null,
		orientation: null,
		origin: null,
		overflow: null,
		overlay: null,
		overlinePosition: F,
		overlineThickness: F,
		paintOrder: null,
		panose1: null,
		path: null,
		pathLength: F,
		patternContentUnits: null,
		patternTransform: null,
		patternUnits: null,
		phase: null,
		ping: I,
		pitch: null,
		playbackOrder: null,
		pointerEvents: null,
		points: null,
		pointsAtX: F,
		pointsAtY: F,
		pointsAtZ: F,
		preserveAlpha: null,
		preserveAspectRatio: null,
		primitiveUnits: null,
		propagate: null,
		property: L,
		r: null,
		radius: null,
		referrerPolicy: null,
		refX: null,
		refY: null,
		rel: L,
		rev: L,
		renderingIntent: null,
		repeatCount: null,
		repeatDur: null,
		requiredExtensions: L,
		requiredFeatures: L,
		requiredFonts: L,
		requiredFormats: L,
		resource: null,
		restart: null,
		result: null,
		rotate: null,
		rx: null,
		ry: null,
		scale: null,
		seed: null,
		shapeRendering: null,
		side: null,
		slope: null,
		snapshotTime: null,
		specularConstant: F,
		specularExponent: F,
		spreadMethod: null,
		spacing: null,
		startOffset: null,
		stdDeviation: null,
		stemh: null,
		stemv: null,
		stitchTiles: null,
		stopColor: null,
		stopOpacity: null,
		strikethroughPosition: F,
		strikethroughThickness: F,
		string: null,
		stroke: null,
		strokeDashArray: L,
		strokeDashOffset: null,
		strokeLineCap: null,
		strokeLineJoin: null,
		strokeMiterLimit: F,
		strokeOpacity: F,
		strokeWidth: null,
		style: null,
		surfaceScale: F,
		syncBehavior: null,
		syncBehaviorDefault: null,
		syncMaster: null,
		syncTolerance: null,
		syncToleranceDefault: null,
		systemLanguage: L,
		tabIndex: F,
		tableValues: null,
		target: null,
		targetX: F,
		targetY: F,
		textAnchor: null,
		textDecoration: null,
		textRendering: null,
		textLength: null,
		timelineBegin: null,
		title: null,
		transformBehavior: null,
		type: null,
		typeOf: L,
		to: null,
		transform: null,
		transformOrigin: null,
		u1: null,
		u2: null,
		underlinePosition: F,
		underlineThickness: F,
		unicode: null,
		unicodeBidi: null,
		unicodeRange: null,
		unitsPerEm: F,
		values: null,
		vAlphabetic: F,
		vMathematical: F,
		vectorEffect: null,
		vHanging: F,
		vIdeographic: F,
		version: null,
		vertAdvY: F,
		vertOriginX: F,
		vertOriginY: F,
		viewBox: null,
		viewTarget: null,
		visibility: null,
		width: null,
		widths: null,
		wordSpacing: null,
		writingMode: null,
		x: null,
		x1: null,
		x2: null,
		xChannelSelector: null,
		xHeight: F,
		y: null,
		y1: null,
		y2: null,
		yChannelSelector: null,
		z: null,
		zoomAndPan: null
	},
	space: "svg",
	transform: fe
}), ge = ue({
	properties: {
		xLinkActuate: null,
		xLinkArcRole: null,
		xLinkHref: null,
		xLinkRole: null,
		xLinkShow: null,
		xLinkTitle: null,
		xLinkType: null
	},
	space: "xlink",
	transform(e, t) {
		return "xlink:" + t.slice(5).toLowerCase();
	}
}), _e = ue({
	attributes: { xmlnsxlink: "xmlns:xlink" },
	properties: {
		xmlnsXLink: null,
		xmlns: null
	},
	space: "xmlns",
	transform: pe
}), ve = ue({
	properties: {
		xmlBase: null,
		xmlLang: null,
		xmlSpace: null
	},
	space: "xml",
	transform(e, t) {
		return "xml:" + t.slice(3).toLowerCase();
	}
}), ye = {
	classId: "classID",
	dataType: "datatype",
	itemId: "itemID",
	strokeDashArray: "strokeDasharray",
	strokeDashOffset: "strokeDashoffset",
	strokeLineCap: "strokeLinecap",
	strokeLineJoin: "strokeLinejoin",
	strokeMiterLimit: "strokeMiterlimit",
	typeOf: "typeof",
	xLinkActuate: "xlinkActuate",
	xLinkArcRole: "xlinkArcrole",
	xLinkHref: "xlinkHref",
	xLinkRole: "xlinkRole",
	xLinkShow: "xlinkShow",
	xLinkTitle: "xlinkTitle",
	xLinkType: "xlinkType",
	xmlnsXLink: "xmlnsXlink"
}, be = /[A-Z]/g, xe = /-[a-z]/g, Se = /^data[-\w.:]+$/i;
function Ce(e, t) {
	let n = j(t), r = t, i = M;
	if (n in e.normal) return e.property[e.normal[n]];
	if (n.length > 4 && n.slice(0, 4) === "data" && Se.test(t)) {
		if (t.charAt(4) === "-") {
			let e = t.slice(5).replace(xe, Te);
			r = "data" + e.charAt(0).toUpperCase() + e.slice(1);
		} else {
			let e = t.slice(4);
			if (!xe.test(e)) {
				let n = e.replace(be, we);
				n.charAt(0) !== "-" && (n = "-" + n), t = "data" + n;
			}
		}
		i = ce;
	}
	return new i(r, t);
}
function we(e) {
	return "-" + e.toLowerCase();
}
function Te(e) {
	return e.charAt(1).toUpperCase();
}
//#endregion
//#region node_modules/property-information/index.js
var Ee = te([
	de,
	me,
	ge,
	_e,
	ve
], "html"), De = te([
	de,
	he,
	ge,
	_e,
	ve
], "svg");
//#endregion
//#region node_modules/space-separated-tokens/index.js
function Oe(e) {
	return e.join(" ").trim();
}
//#endregion
//#region node_modules/inline-style-parser/cjs/index.js
var ke = /* @__PURE__ */ o(((e, t) => {
	var n = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, r = /\n/g, i = /^\s*/, a = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, o = /^:\s*/, s = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, c = /^[;\s]*/, l = /^\s+|\s+$/g, u = "\n", d = "/", f = "*", p = "", m = "comment", h = "declaration";
	function g(e, t) {
		if (typeof e != "string") throw TypeError("First argument must be a string");
		if (!e) return [];
		t ||= {};
		var l = 1, g = 1;
		function v(e) {
			var t = e.match(r);
			t && (l += t.length);
			var n = e.lastIndexOf(u);
			g = ~n ? e.length - n : g + e.length;
		}
		function y() {
			var e = {
				line: l,
				column: g
			};
			return function(t) {
				return t.position = new b(e), C(), t;
			};
		}
		function b(e) {
			this.start = e, this.end = {
				line: l,
				column: g
			}, this.source = t.source;
		}
		b.prototype.content = e;
		function x(n) {
			var r = /* @__PURE__ */ Error(t.source + ":" + l + ":" + g + ": " + n);
			if (r.reason = n, r.filename = t.source, r.line = l, r.column = g, r.source = e, !t.silent) throw r;
		}
		function S(t) {
			var n = t.exec(e);
			if (n) {
				var r = n[0];
				return v(r), e = e.slice(r.length), n;
			}
		}
		function C() {
			S(i);
		}
		function w(e) {
			var t;
			for (e ||= []; t = T();) t !== !1 && e.push(t);
			return e;
		}
		function T() {
			var t = y();
			if (!(d != e.charAt(0) || f != e.charAt(1))) {
				for (var n = 2; p != e.charAt(n) && (f != e.charAt(n) || d != e.charAt(n + 1));) ++n;
				if (n += 2, p === e.charAt(n - 1)) return x("End of comment missing");
				var r = e.slice(2, n - 2);
				return g += 2, v(r), e = e.slice(n), g += 2, t({
					type: m,
					comment: r
				});
			}
		}
		function E() {
			var e = y(), t = S(a);
			if (t) {
				if (T(), !S(o)) return x("property missing ':'");
				var r = S(s), i = e({
					type: h,
					property: _(t[0].replace(n, p)),
					value: r ? _(r[0].replace(n, p)) : p
				});
				return S(c), i;
			}
		}
		function D() {
			var e = [];
			w(e);
			for (var t; t = E();) t !== !1 && (e.push(t), w(e));
			return e;
		}
		return C(), D();
	}
	function _(e) {
		return e ? e.replace(l, p) : p;
	}
	t.exports = g;
})), Ae = /* @__PURE__ */ o(((e) => {
	var t = e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = r;
	var n = t(ke());
	function r(e, t) {
		let r = null;
		if (!e || typeof e != "string") return r;
		let i = (0, n.default)(e), a = typeof t == "function";
		return i.forEach((e) => {
			if (e.type !== "declaration") return;
			let { property: n, value: i } = e;
			a ? t(n, i, e) : i && (r ||= {}, r[n] = i);
		}), r;
	}
})), je = /* @__PURE__ */ o(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.camelCase = void 0;
	var t = /^--[a-zA-Z0-9_-]+$/, n = /-([a-z])/g, r = /^[^-]+$/, i = /^-(webkit|moz|ms|o|khtml)-/, a = /^-(ms)-/, o = function(e) {
		return !e || r.test(e) || t.test(e);
	}, s = function(e, t) {
		return t.toUpperCase();
	}, c = function(e, t) {
		return `${t}-`;
	};
	e.camelCase = function(e, t) {
		return t === void 0 && (t = {}), o(e) ? e : (e = e.toLowerCase(), e = t.reactCompat ? e.replace(a, c) : e.replace(i, c), e.replace(n, s));
	};
})), Me = /* @__PURE__ */ o(((e, t) => {
	var n = (e && e.__importDefault || function(e) {
		return e && e.__esModule ? e : { default: e };
	})(Ae()), r = je();
	function i(e, t) {
		var i = {};
		return !e || typeof e != "string" || (0, n.default)(e, function(e, n) {
			e && n && (i[(0, r.camelCase)(e, t)] = n);
		}), i;
	}
	i.default = i, t.exports = i;
})), Ne = Fe("end"), Pe = Fe("start");
function Fe(e) {
	return t;
	function t(t) {
		let n = t && t.position && t.position[e] || {};
		if (typeof n.line == "number" && n.line > 0 && typeof n.column == "number" && n.column > 0) return {
			line: n.line,
			column: n.column,
			offset: typeof n.offset == "number" && n.offset > -1 ? n.offset : void 0
		};
	}
}
function Ie(e) {
	let t = Pe(e), n = Ne(e);
	if (t && n) return {
		start: t,
		end: n
	};
}
//#endregion
//#region node_modules/unist-util-stringify-position/lib/index.js
function Le(e) {
	return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? ze(e.position) : "start" in e || "end" in e ? ze(e) : "line" in e || "column" in e ? Re(e) : "";
}
function Re(e) {
	return Be(e && e.line) + ":" + Be(e && e.column);
}
function ze(e) {
	return Re(e && e.start) + "-" + Re(e && e.end);
}
function Be(e) {
	return e && typeof e == "number" ? e : 1;
}
//#endregion
//#region node_modules/vfile-message/lib/index.js
var R = class extends Error {
	constructor(e, t, n) {
		super(), typeof t == "string" && (n = t, t = void 0);
		let r = "", i = {}, a = !1;
		if (t && (i = "line" in t && "column" in t || "start" in t && "end" in t ? { place: t } : "type" in t ? {
			ancestors: [t],
			place: t.position
		} : { ...t }), typeof e == "string" ? r = e : !i.cause && e && (a = !0, r = e.message, i.cause = e), !i.ruleId && !i.source && typeof n == "string") {
			let e = n.indexOf(":");
			e === -1 ? i.ruleId = n : (i.source = n.slice(0, e), i.ruleId = n.slice(e + 1));
		}
		if (!i.place && i.ancestors && i.ancestors) {
			let e = i.ancestors[i.ancestors.length - 1];
			e && (i.place = e.position);
		}
		let o = i.place && "start" in i.place ? i.place.start : i.place;
		this.ancestors = i.ancestors || void 0, this.cause = i.cause || void 0, this.column = o ? o.column : void 0, this.fatal = void 0, this.file = "", this.message = r, this.line = o ? o.line : void 0, this.name = Le(i.place) || "1:1", this.place = i.place || void 0, this.reason = this.message, this.ruleId = i.ruleId || void 0, this.source = i.source || void 0, this.stack = a && i.cause && typeof i.cause.stack == "string" ? i.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
	}
};
R.prototype.file = "", R.prototype.name = "", R.prototype.reason = "", R.prototype.message = "", R.prototype.stack = "", R.prototype.column = void 0, R.prototype.line = void 0, R.prototype.ancestors = void 0, R.prototype.cause = void 0, R.prototype.fatal = void 0, R.prototype.place = void 0, R.prototype.ruleId = void 0, R.prototype.source = void 0;
//#endregion
//#region node_modules/hast-util-to-jsx-runtime/lib/index.js
var Ve = /* @__PURE__ */ l(Me(), 1), He = {}.hasOwnProperty, Ue = /* @__PURE__ */ new Map(), We = /[A-Z]/g, Ge = new Set([
	"table",
	"tbody",
	"thead",
	"tfoot",
	"tr"
]), Ke = new Set(["td", "th"]);
function qe(e, t) {
	if (!t || t.Fragment === void 0) throw TypeError("Expected `Fragment` in options");
	let n = t.filePath || void 0, r;
	if (t.development) {
		if (typeof t.jsxDEV != "function") throw TypeError("Expected `jsxDEV` in options when `development: true`");
		r = it(n, t.jsxDEV);
	} else {
		if (typeof t.jsx != "function") throw TypeError("Expected `jsx` in production options");
		if (typeof t.jsxs != "function") throw TypeError("Expected `jsxs` in production options");
		r = rt(n, t.jsx, t.jsxs);
	}
	let i = {
		Fragment: t.Fragment,
		ancestors: [],
		components: t.components || {},
		create: r,
		elementAttributeNameCase: t.elementAttributeNameCase || "react",
		evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
		filePath: n,
		ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
		passKeys: t.passKeys !== !1,
		passNode: t.passNode || !1,
		schema: t.space === "svg" ? De : Ee,
		stylePropertyNameCase: t.stylePropertyNameCase || "dom",
		tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
	}, a = Je(i, e, void 0);
	return a && typeof a != "string" ? a : i.create(e, i.Fragment, { children: a || void 0 }, void 0);
}
function Je(e, t, n) {
	if (t.type === "element") return Ye(e, t, n);
	if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression") return Xe(e, t);
	if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement") return Qe(e, t, n);
	if (t.type === "mdxjsEsm") return Ze(e, t);
	if (t.type === "root") return $e(e, t, n);
	if (t.type === "text") return et(e, t);
}
function Ye(e, t, n) {
	let r = e.schema, i = r;
	t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = De, e.schema = i), e.ancestors.push(t);
	let a = ut(e, t.tagName, !1), o = at(e, t), s = st(e, t);
	return Ge.has(t.tagName) && (s = s.filter(function(e) {
		return typeof e == "string" ? !k(e) : !0;
	})), tt(e, o, a, t), nt(o, s), e.ancestors.pop(), e.schema = r, e.create(t, a, o, n);
}
function Xe(e, t) {
	if (t.data && t.data.estree && e.evaluater) {
		let n = t.data.estree.body[0];
		return n.type, e.evaluater.evaluateExpression(n.expression);
	}
	dt(e, t.position);
}
function Ze(e, t) {
	if (t.data && t.data.estree && e.evaluater) return e.evaluater.evaluateProgram(t.data.estree);
	dt(e, t.position);
}
function Qe(e, t, n) {
	let r = e.schema, i = r;
	t.name === "svg" && r.space === "html" && (i = De, e.schema = i), e.ancestors.push(t);
	let a = t.name === null ? e.Fragment : ut(e, t.name, !0), o = ot(e, t), s = st(e, t);
	return tt(e, o, a, t), nt(o, s), e.ancestors.pop(), e.schema = r, e.create(t, a, o, n);
}
function $e(e, t, n) {
	let r = {};
	return nt(r, st(e, t)), e.create(t, e.Fragment, r, n);
}
function et(e, t) {
	return t.value;
}
function tt(e, t, n, r) {
	typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function nt(e, t) {
	if (t.length > 0) {
		let n = t.length > 1 ? t : t[0];
		n && (e.children = n);
	}
}
function rt(e, t, n) {
	return r;
	function r(e, r, i, a) {
		let o = Array.isArray(i.children) ? n : t;
		return a ? o(r, i, a) : o(r, i);
	}
}
function it(e, t) {
	return n;
	function n(n, r, i, a) {
		let o = Array.isArray(i.children), s = Pe(n);
		return t(r, i, a, o, {
			columnNumber: s ? s.column - 1 : void 0,
			fileName: e,
			lineNumber: s ? s.line : void 0
		}, void 0);
	}
}
function at(e, t) {
	let n = {}, r, i;
	for (i in t.properties) if (i !== "children" && He.call(t.properties, i)) {
		let a = ct(e, i, t.properties[i]);
		if (a) {
			let [i, o] = a;
			e.tableCellAlignToStyle && i === "align" && typeof o == "string" && Ke.has(t.tagName) ? r = o : n[i] = o;
		}
	}
	if (r) {
		let t = n.style ||= {};
		t[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
	}
	return n;
}
function ot(e, t) {
	let n = {};
	for (let r of t.attributes) if (r.type === "mdxJsxExpressionAttribute") if (r.data && r.data.estree && e.evaluater) {
		let t = r.data.estree.body[0];
		t.type;
		let i = t.expression;
		i.type;
		let a = i.properties[0];
		a.type, Object.assign(n, e.evaluater.evaluateExpression(a.argument));
	} else dt(e, t.position);
	else {
		let i = r.name, a;
		if (r.value && typeof r.value == "object") if (r.value.data && r.value.data.estree && e.evaluater) {
			let t = r.value.data.estree.body[0];
			t.type, a = e.evaluater.evaluateExpression(t.expression);
		} else dt(e, t.position);
		else a = r.value === null ? !0 : r.value;
		n[i] = a;
	}
	return n;
}
function st(e, t) {
	let n = [], r = -1, i = e.passKeys ? /* @__PURE__ */ new Map() : Ue;
	for (; ++r < t.children.length;) {
		let a = t.children[r], o;
		if (e.passKeys) {
			let e = a.type === "element" ? a.tagName : a.type === "mdxJsxFlowElement" || a.type === "mdxJsxTextElement" ? a.name : void 0;
			if (e) {
				let t = i.get(e) || 0;
				o = e + "-" + t, i.set(e, t + 1);
			}
		}
		let s = Je(e, a, o);
		s !== void 0 && n.push(s);
	}
	return n;
}
function ct(e, t, n) {
	let r = Ce(e.schema, t);
	if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
		if (Array.isArray(n) && (n = r.commaSeparated ? C(n) : Oe(n)), r.property === "style") {
			let t = typeof n == "object" ? n : lt(e, String(n));
			return e.stylePropertyNameCase === "css" && (t = ft(t)), ["style", t];
		}
		return [e.elementAttributeNameCase === "react" && r.space ? ye[r.property] || r.property : r.attribute, n];
	}
}
function lt(e, t) {
	try {
		return (0, Ve.default)(t, { reactCompat: !0 });
	} catch (t) {
		if (e.ignoreInvalidStyle) return {};
		let n = t, r = new R("Cannot parse `style` attribute", {
			ancestors: e.ancestors,
			cause: n,
			ruleId: "style",
			source: "hast-util-to-jsx-runtime"
		});
		throw r.file = e.filePath || void 0, r.url = "https://github.com/syntax-tree/hast-util-to-jsx-runtime#cannot-parse-style-attribute", r;
	}
}
function ut(e, t, n) {
	let r;
	if (!n) r = {
		type: "Literal",
		value: t
	};
	else if (t.includes(".")) {
		let e = t.split("."), n = -1, i;
		for (; ++n < e.length;) {
			let t = D(e[n]) ? {
				type: "Identifier",
				name: e[n]
			} : {
				type: "Literal",
				value: e[n]
			};
			i = i ? {
				type: "MemberExpression",
				object: i,
				property: t,
				computed: !!(n && t.type === "Literal"),
				optional: !1
			} : t;
		}
		r = i;
	} else r = D(t) && !/^[a-z]/.test(t) ? {
		type: "Identifier",
		name: t
	} : {
		type: "Literal",
		value: t
	};
	if (r.type === "Literal") {
		let t = r.value;
		return He.call(e.components, t) ? e.components[t] : t;
	}
	if (e.evaluater) return e.evaluater.evaluateExpression(r);
	dt(e);
}
function dt(e, t) {
	let n = new R("Cannot handle MDX estrees without `createEvaluater`", {
		ancestors: e.ancestors,
		place: t,
		ruleId: "mdx-estree",
		source: "hast-util-to-jsx-runtime"
	});
	throw n.file = e.filePath || void 0, n.url = "https://github.com/syntax-tree/hast-util-to-jsx-runtime#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function ft(e) {
	let t = {}, n;
	for (n in e) He.call(e, n) && (t[pt(n)] = e[n]);
	return t;
}
function pt(e) {
	let t = e.replace(We, mt);
	return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function mt(e) {
	return "-" + e.toLowerCase();
}
//#endregion
//#region node_modules/html-url-attributes/lib/index.js
var ht = {
	action: ["form"],
	cite: [
		"blockquote",
		"del",
		"ins",
		"q"
	],
	data: ["object"],
	formAction: ["button", "input"],
	href: [
		"a",
		"area",
		"base",
		"link"
	],
	icon: ["menuitem"],
	itemId: null,
	manifest: ["html"],
	ping: ["a", "area"],
	poster: ["video"],
	src: [
		"audio",
		"embed",
		"iframe",
		"img",
		"input",
		"script",
		"source",
		"track",
		"video"
	]
}, gt = globalThis.__FYUO_PLUGIN_HOST_V1__?.["react/jsx-runtime"];
if (!gt) throw Error("Plugin requires blog host API v1");
gt.default;
var _t = gt.Fragment, z = gt.jsx, B = gt.jsxs, vt = {};
function yt(e, t) {
	let n = t || vt;
	return bt(e, typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, typeof n.includeHtml == "boolean" ? n.includeHtml : !0);
}
function bt(e, t, n) {
	if (St(e)) {
		if ("value" in e) return e.type === "html" && !n ? "" : e.value;
		if (t && "alt" in e && e.alt) return e.alt;
		if ("children" in e) return xt(e.children, t, n);
	}
	return Array.isArray(e) ? xt(e, t, n) : "";
}
function xt(e, t, n) {
	let r = [], i = -1;
	for (; ++i < e.length;) r[i] = bt(e[i], t, n);
	return r.join("");
}
function St(e) {
	return !!(e && typeof e == "object");
}
//#endregion
//#region node_modules/decode-named-character-reference/index.dom.js
var Ct = document.createElement("i");
function wt(e) {
	let t = "&" + e + ";";
	Ct.innerHTML = t;
	let n = Ct.textContent;
	return n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n;
}
//#endregion
//#region node_modules/micromark-util-chunked/index.js
function Tt(e, t, n, r) {
	let i = e.length, a = 0, o;
	if (t = t < 0 ? -t > i ? 0 : i + t : t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4) o = Array.from(r), o.unshift(t, n), e.splice(...o);
	else for (n && e.splice(t, n); a < r.length;) o = r.slice(a, a + 1e4), o.unshift(t, 0), e.splice(...o), a += 1e4, t += 1e4;
}
function Et(e, t) {
	return e.length > 0 ? (Tt(e, e.length, 0, t), e) : t;
}
//#endregion
//#region node_modules/micromark-util-combine-extensions/index.js
var Dt = {}.hasOwnProperty;
function Ot(e) {
	let t = {}, n = -1;
	for (; ++n < e.length;) kt(t, e[n]);
	return t;
}
function kt(e, t) {
	let n;
	for (n in t) {
		let r = (Dt.call(e, n) ? e[n] : void 0) || (e[n] = {}), i = t[n], a;
		if (i) for (a in i) {
			Dt.call(r, a) || (r[a] = []);
			let e = i[a];
			At(r[a], Array.isArray(e) ? e : e ? [e] : []);
		}
	}
}
function At(e, t) {
	let n = -1, r = [];
	for (; ++n < t.length;) (t[n].add === "after" ? e : r).push(t[n]);
	Tt(e, 0, 0, r);
}
//#endregion
//#region node_modules/micromark-util-decode-numeric-character-reference/index.js
function jt(e, t) {
	let n = Number.parseInt(e, t);
	return n < 9 || n === 11 || n > 13 && n < 32 || n > 126 && n < 160 || n > 55295 && n < 57344 || n > 64975 && n < 65008 || (n & 65535) == 65535 || (n & 65535) == 65534 || n > 1114111 ? "�" : String.fromCodePoint(n);
}
//#endregion
//#region node_modules/micromark-util-normalize-identifier/index.js
function Mt(e) {
	return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
//#endregion
//#region node_modules/micromark-util-character/index.js
var V = Bt(/[A-Za-z]/), H = Bt(/[\dA-Za-z]/), Nt = Bt(/[#-'*+\--9=?A-Z^-~]/);
function Pt(e) {
	return e !== null && (e < 32 || e === 127);
}
var Ft = Bt(/\d/), It = Bt(/[\dA-Fa-f]/), Lt = Bt(/[!-/:-@[-`{-~]/);
function U(e) {
	return e !== null && e < -2;
}
function W(e) {
	return e !== null && (e < 0 || e === 32);
}
function G(e) {
	return e === -2 || e === -1 || e === 32;
}
var Rt = Bt(/\p{P}|\p{S}/u), zt = Bt(/\s/);
function Bt(e) {
	return t;
	function t(t) {
		return t !== null && t > -1 && e.test(String.fromCharCode(t));
	}
}
//#endregion
//#region node_modules/micromark-util-sanitize-uri/index.js
function Vt(e) {
	let t = [], n = -1, r = 0, i = 0;
	for (; ++n < e.length;) {
		let a = e.charCodeAt(n), o = "";
		if (a === 37 && H(e.charCodeAt(n + 1)) && H(e.charCodeAt(n + 2))) i = 2;
		else if (a < 128) /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a)) || (o = String.fromCharCode(a));
		else if (a > 55295 && a < 57344) {
			let t = e.charCodeAt(n + 1);
			a < 56320 && t > 56319 && t < 57344 ? (o = String.fromCharCode(a, t), i = 1) : o = "�";
		} else o = String.fromCharCode(a);
		o &&= (t.push(e.slice(r, n), encodeURIComponent(o)), r = n + i + 1, ""), i &&= (n += i, 0);
	}
	return t.join("") + e.slice(r);
}
//#endregion
//#region node_modules/micromark-factory-space/index.js
function K(e, t, n, r) {
	let i = r ? r - 1 : Infinity, a = 0;
	return o;
	function o(r) {
		return G(r) ? (e.enter(n), s(r)) : t(r);
	}
	function s(r) {
		return G(r) && a++ < i ? (e.consume(r), s) : (e.exit(n), t(r));
	}
}
//#endregion
//#region node_modules/micromark/lib/initialize/content.js
var Ht = { tokenize: Ut };
function Ut(e) {
	let t = e.attempt(this.parser.constructs.contentInitial, r, i), n;
	return t;
	function r(n) {
		if (n === null) {
			e.consume(n);
			return;
		}
		return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), K(e, t, "linePrefix");
	}
	function i(t) {
		return e.enter("paragraph"), a(t);
	}
	function a(t) {
		let r = e.enter("chunkText", {
			contentType: "text",
			previous: n
		});
		return n && (n.next = r), n = r, o(t);
	}
	function o(t) {
		if (t === null) {
			e.exit("chunkText"), e.exit("paragraph"), e.consume(t);
			return;
		}
		return U(t) ? (e.consume(t), e.exit("chunkText"), a) : (e.consume(t), o);
	}
}
//#endregion
//#region node_modules/micromark/lib/initialize/document.js
var Wt = { tokenize: Kt }, Gt = { tokenize: qt };
function Kt(e) {
	let t = this, n = [], r = 0, i, a, o;
	return s;
	function s(i) {
		if (r < n.length) {
			let a = n[r];
			return t.containerState = a[1], e.attempt(a[0].continuation, c, l)(i);
		}
		return l(i);
	}
	function c(e) {
		if (r++, t.containerState._closeFlow) {
			t.containerState._closeFlow = void 0, i && v();
			let n = t.events.length, a = n, o;
			for (; a--;) if (t.events[a][0] === "exit" && t.events[a][1].type === "chunkFlow") {
				o = t.events[a][1].end;
				break;
			}
			_(r);
			let s = n;
			for (; s < t.events.length;) t.events[s][1].end = { ...o }, s++;
			return Tt(t.events, a + 1, 0, t.events.slice(n)), t.events.length = s, l(e);
		}
		return s(e);
	}
	function l(a) {
		if (r === n.length) {
			if (!i) return f(a);
			if (i.currentConstruct && i.currentConstruct.concrete) return m(a);
			t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
		}
		return t.containerState = {}, e.check(Gt, u, d)(a);
	}
	function u(e) {
		return i && v(), _(r), f(e);
	}
	function d(e) {
		return t.parser.lazy[t.now().line] = r !== n.length, o = t.now().offset, m(e);
	}
	function f(n) {
		return t.containerState = {}, e.attempt(Gt, p, m)(n);
	}
	function p(e) {
		return r++, n.push([t.currentConstruct, t.containerState]), f(e);
	}
	function m(n) {
		if (n === null) {
			i && v(), _(0), e.consume(n);
			return;
		}
		return i ||= t.parser.flow(t.now()), e.enter("chunkFlow", {
			_tokenizer: i,
			contentType: "flow",
			previous: a
		}), h(n);
	}
	function h(n) {
		if (n === null) {
			g(e.exit("chunkFlow"), !0), _(0), e.consume(n);
			return;
		}
		return U(n) ? (e.consume(n), g(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, s) : (e.consume(n), h);
	}
	function g(e, n) {
		let s = t.sliceStream(e);
		if (n && s.push(null), e.previous = a, a && (a.next = e), a = e, i.defineSkip(e.start), i.write(s), t.parser.lazy[e.start.line]) {
			let e = i.events.length;
			for (; e--;) if (i.events[e][1].start.offset < o && (!i.events[e][1].end || i.events[e][1].end.offset > o)) return;
			let n = t.events.length, a = n, s, c;
			for (; a--;) if (t.events[a][0] === "exit" && t.events[a][1].type === "chunkFlow") {
				if (s) {
					c = t.events[a][1].end;
					break;
				}
				s = !0;
			}
			for (_(r), e = n; e < t.events.length;) t.events[e][1].end = { ...c }, e++;
			Tt(t.events, a + 1, 0, t.events.slice(n)), t.events.length = e;
		}
	}
	function _(r) {
		let i = n.length;
		for (; i-- > r;) {
			let r = n[i];
			t.containerState = r[1], r[0].exit.call(t, e);
		}
		n.length = r;
	}
	function v() {
		i.write([null]), a = void 0, i = void 0, t.containerState._closeFlow = void 0;
	}
}
function qt(e, t, n) {
	return K(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
//#endregion
//#region node_modules/micromark-util-classify-character/index.js
function Jt(e) {
	if (e === null || W(e) || zt(e)) return 1;
	if (Rt(e)) return 2;
}
//#endregion
//#region node_modules/micromark-util-resolve-all/index.js
function Yt(e, t, n) {
	let r = [], i = -1;
	for (; ++i < e.length;) {
		let a = e[i].resolveAll;
		a && !r.includes(a) && (t = a(t, n), r.push(a));
	}
	return t;
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/attention.js
var Xt = {
	name: "attention",
	resolveAll: Zt,
	tokenize: Qt
};
function Zt(e, t) {
	let n = -1, r, i, a, o, s, c, l, u;
	for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
		for (r = n; r--;) if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
			if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3)) continue;
			c = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
			let d = { ...e[r][1].end }, f = { ...e[n][1].start };
			$t(d, -c), $t(f, c), o = {
				type: c > 1 ? "strongSequence" : "emphasisSequence",
				start: d,
				end: { ...e[r][1].end }
			}, s = {
				type: c > 1 ? "strongSequence" : "emphasisSequence",
				start: { ...e[n][1].start },
				end: f
			}, a = {
				type: c > 1 ? "strongText" : "emphasisText",
				start: { ...e[r][1].end },
				end: { ...e[n][1].start }
			}, i = {
				type: c > 1 ? "strong" : "emphasis",
				start: { ...o.start },
				end: { ...s.end }
			}, e[r][1].end = { ...o.start }, e[n][1].start = { ...s.end }, l = [], e[r][1].end.offset - e[r][1].start.offset && (l = Et(l, [[
				"enter",
				e[r][1],
				t
			], [
				"exit",
				e[r][1],
				t
			]])), l = Et(l, [
				[
					"enter",
					i,
					t
				],
				[
					"enter",
					o,
					t
				],
				[
					"exit",
					o,
					t
				],
				[
					"enter",
					a,
					t
				]
			]), l = Et(l, Yt(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), l = Et(l, [
				[
					"exit",
					a,
					t
				],
				[
					"enter",
					s,
					t
				],
				[
					"exit",
					s,
					t
				],
				[
					"exit",
					i,
					t
				]
			]), e[n][1].end.offset - e[n][1].start.offset ? (u = 2, l = Et(l, [[
				"enter",
				e[n][1],
				t
			], [
				"exit",
				e[n][1],
				t
			]])) : u = 0, Tt(e, r - 1, n - r + 3, l), n = r + l.length - u - 2;
			break;
		}
	}
	for (n = -1; ++n < e.length;) e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
	return e;
}
function Qt(e, t) {
	let n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = Jt(r), a;
	return o;
	function o(t) {
		return a = t, e.enter("attentionSequence"), s(t);
	}
	function s(o) {
		if (o === a) return e.consume(o), s;
		let c = e.exit("attentionSequence"), l = Jt(o), u = !l || l === 2 && i || n.includes(o), d = !i || i === 2 && l || n.includes(r);
		return c._open = !!(a === 42 ? u : u && (i || !d)), c._close = !!(a === 42 ? d : d && (l || !u)), t(o);
	}
}
function $t(e, t) {
	e.column += t, e.offset += t, e._bufferIndex += t;
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/autolink.js
var en = {
	name: "autolink",
	tokenize: tn
};
function tn(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(t), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), a;
	}
	function a(t) {
		return V(t) ? (e.consume(t), o) : t === 64 ? n(t) : l(t);
	}
	function o(e) {
		return e === 43 || e === 45 || e === 46 || H(e) ? (r = 1, s(e)) : l(e);
	}
	function s(t) {
		return t === 58 ? (e.consume(t), r = 0, c) : (t === 43 || t === 45 || t === 46 || H(t)) && r++ < 32 ? (e.consume(t), s) : (r = 0, l(t));
	}
	function c(r) {
		return r === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(r), e.exit("autolinkMarker"), e.exit("autolink"), t) : r === null || r === 32 || r === 60 || Pt(r) ? n(r) : (e.consume(r), c);
	}
	function l(t) {
		return t === 64 ? (e.consume(t), u) : Nt(t) ? (e.consume(t), l) : n(t);
	}
	function u(e) {
		return H(e) ? d(e) : n(e);
	}
	function d(n) {
		return n === 46 ? (e.consume(n), r = 0, u) : n === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(n), e.exit("autolinkMarker"), e.exit("autolink"), t) : f(n);
	}
	function f(t) {
		if ((t === 45 || H(t)) && r++ < 63) {
			let n = t === 45 ? f : d;
			return e.consume(t), n;
		}
		return n(t);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/blank-line.js
var nn = {
	partial: !0,
	tokenize: rn
};
function rn(e, t, n) {
	return r;
	function r(t) {
		return G(t) ? K(e, i, "linePrefix")(t) : i(t);
	}
	function i(e) {
		return e === null || U(e) ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/block-quote.js
var an = {
	continuation: { tokenize: sn },
	exit: cn,
	name: "blockQuote",
	tokenize: on
};
function on(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		if (t === 62) {
			let n = r.containerState;
			return n.open ||= (e.enter("blockQuote", { _container: !0 }), !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(t), e.exit("blockQuoteMarker"), a;
		}
		return n(t);
	}
	function a(n) {
		return G(n) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(n), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(n));
	}
}
function sn(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return G(t) ? K(e, a, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : a(t);
	}
	function a(r) {
		return e.attempt(an, t, n)(r);
	}
}
function cn(e) {
	e.exit("blockQuote");
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/character-escape.js
var ln = {
	name: "characterEscape",
	tokenize: un
};
function un(e, t, n) {
	return r;
	function r(t) {
		return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(t), e.exit("escapeMarker"), i;
	}
	function i(r) {
		return Lt(r) ? (e.enter("characterEscapeValue"), e.consume(r), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(r);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/character-reference.js
var dn = {
	name: "characterReference",
	tokenize: fn
};
function fn(e, t, n) {
	let r = this, i = 0, a, o;
	return s;
	function s(t) {
		return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(t), e.exit("characterReferenceMarker"), c;
	}
	function c(t) {
		return t === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(t), e.exit("characterReferenceMarkerNumeric"), l) : (e.enter("characterReferenceValue"), a = 31, o = H, u(t));
	}
	function l(t) {
		return t === 88 || t === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(t), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), a = 6, o = It, u) : (e.enter("characterReferenceValue"), a = 7, o = Ft, u(t));
	}
	function u(s) {
		if (s === 59 && i) {
			let i = e.exit("characterReferenceValue");
			return o === H && !wt(r.sliceSerialize(i)) ? n(s) : (e.enter("characterReferenceMarker"), e.consume(s), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
		}
		return o(s) && i++ < a ? (e.consume(s), u) : n(s);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-fenced.js
var pn = {
	partial: !0,
	tokenize: gn
}, mn = {
	concrete: !0,
	name: "codeFenced",
	tokenize: hn
};
function hn(e, t, n) {
	let r = this, i = {
		partial: !0,
		tokenize: x
	}, a = 0, o = 0, s;
	return c;
	function c(e) {
		return l(e);
	}
	function l(t) {
		let n = r.events[r.events.length - 1];
		return a = n && n[1].type === "linePrefix" ? n[2].sliceSerialize(n[1], !0).length : 0, s = t, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), u(t);
	}
	function u(t) {
		return t === s ? (o++, e.consume(t), u) : o < 3 ? n(t) : (e.exit("codeFencedFenceSequence"), G(t) ? K(e, d, "whitespace")(t) : d(t));
	}
	function d(n) {
		return n === null || U(n) ? (e.exit("codeFencedFence"), r.interrupt ? t(n) : e.check(pn, h, b)(n)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", { contentType: "string" }), f(n));
	}
	function f(t) {
		return t === null || U(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), d(t)) : G(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), K(e, p, "whitespace")(t)) : t === 96 && t === s ? n(t) : (e.consume(t), f);
	}
	function p(t) {
		return t === null || U(t) ? d(t) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", { contentType: "string" }), m(t));
	}
	function m(t) {
		return t === null || U(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), d(t)) : t === 96 && t === s ? n(t) : (e.consume(t), m);
	}
	function h(t) {
		return e.attempt(i, b, g)(t);
	}
	function g(t) {
		return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), _;
	}
	function _(t) {
		return a > 0 && G(t) ? K(e, v, "linePrefix", a + 1)(t) : v(t);
	}
	function v(t) {
		return t === null || U(t) ? e.check(pn, h, b)(t) : (e.enter("codeFlowValue"), y(t));
	}
	function y(t) {
		return t === null || U(t) ? (e.exit("codeFlowValue"), v(t)) : (e.consume(t), y);
	}
	function b(n) {
		return e.exit("codeFenced"), t(n);
	}
	function x(e, t, n) {
		let i = 0;
		return a;
		function a(t) {
			return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c;
		}
		function c(t) {
			return e.enter("codeFencedFence"), G(t) ? K(e, l, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : l(t);
		}
		function l(t) {
			return t === s ? (e.enter("codeFencedFenceSequence"), u(t)) : n(t);
		}
		function u(t) {
			return t === s ? (i++, e.consume(t), u) : i >= o ? (e.exit("codeFencedFenceSequence"), G(t) ? K(e, d, "whitespace")(t) : d(t)) : n(t);
		}
		function d(r) {
			return r === null || U(r) ? (e.exit("codeFencedFence"), t(r)) : n(r);
		}
	}
}
function gn(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return t === null ? n(t) : (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), a);
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-indented.js
var _n = {
	name: "codeIndented",
	tokenize: yn
}, vn = {
	partial: !0,
	tokenize: bn
};
function yn(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("codeIndented"), K(e, a, "linePrefix", 5)(t);
	}
	function a(e) {
		let t = r.events[r.events.length - 1];
		return t && t[1].type === "linePrefix" && t[2].sliceSerialize(t[1], !0).length >= 4 ? o(e) : n(e);
	}
	function o(t) {
		return t === null ? c(t) : U(t) ? e.attempt(vn, o, c)(t) : (e.enter("codeFlowValue"), s(t));
	}
	function s(t) {
		return t === null || U(t) ? (e.exit("codeFlowValue"), o(t)) : (e.consume(t), s);
	}
	function c(n) {
		return e.exit("codeIndented"), t(n);
	}
}
function bn(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return r.parser.lazy[r.now().line] ? n(t) : U(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), i) : K(e, a, "linePrefix", 5)(t);
	}
	function a(e) {
		let a = r.events[r.events.length - 1];
		return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(e) : U(e) ? i(e) : n(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-text.js
var xn = {
	name: "codeText",
	previous: Cn,
	resolve: Sn,
	tokenize: wn
};
function Sn(e) {
	let t = e.length - 4, n = 3, r, i;
	if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
		for (r = n; ++r < t;) if (e[r][1].type === "codeTextData") {
			e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
			break;
		}
	}
	for (r = n - 1, t++; ++r <= t;) i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
	return e;
}
function Cn(e) {
	return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function wn(e, t, n) {
	let r = 0, i, a;
	return o;
	function o(t) {
		return e.enter("codeText"), e.enter("codeTextSequence"), s(t);
	}
	function s(t) {
		return t === 96 ? (e.consume(t), r++, s) : (e.exit("codeTextSequence"), c(t));
	}
	function c(t) {
		return t === null ? n(t) : t === 32 ? (e.enter("space"), e.consume(t), e.exit("space"), c) : t === 96 ? (a = e.enter("codeTextSequence"), i = 0, u(t)) : U(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c) : (e.enter("codeTextData"), l(t));
	}
	function l(t) {
		return t === null || t === 32 || t === 96 || U(t) ? (e.exit("codeTextData"), c(t)) : (e.consume(t), l);
	}
	function u(n) {
		return n === 96 ? (e.consume(n), i++, u) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(n)) : (a.type = "codeTextData", l(n));
	}
}
//#endregion
//#region node_modules/micromark-util-subtokenize/lib/splice-buffer.js
var Tn = class {
	constructor(e) {
		this.left = e ? [...e] : [], this.right = [];
	}
	get(e) {
		if (e < 0 || e >= this.left.length + this.right.length) throw RangeError("Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
		return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1];
	}
	get length() {
		return this.left.length + this.right.length;
	}
	shift() {
		return this.setCursor(0), this.right.pop();
	}
	slice(e, t) {
		let n = t ?? Infinity;
		return n < this.left.length ? this.left.slice(e, n) : e > this.left.length ? this.right.slice(this.right.length - n + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - n + this.left.length).reverse());
	}
	splice(e, t, n) {
		let r = t || 0;
		this.setCursor(Math.trunc(e));
		let i = this.right.splice(this.right.length - r, Infinity);
		return n && En(this.left, n), i.reverse();
	}
	pop() {
		return this.setCursor(Infinity), this.left.pop();
	}
	push(e) {
		this.setCursor(Infinity), this.left.push(e);
	}
	pushMany(e) {
		this.setCursor(Infinity), En(this.left, e);
	}
	unshift(e) {
		this.setCursor(0), this.right.push(e);
	}
	unshiftMany(e) {
		this.setCursor(0), En(this.right, e.reverse());
	}
	setCursor(e) {
		if (!(e === this.left.length || e > this.left.length && this.right.length === 0 || e < 0 && this.left.length === 0)) if (e < this.left.length) {
			let t = this.left.splice(e, Infinity);
			En(this.right, t.reverse());
		} else {
			let t = this.right.splice(this.left.length + this.right.length - e, Infinity);
			En(this.left, t.reverse());
		}
	}
};
function En(e, t) {
	let n = 0;
	if (t.length < 1e4) e.push(...t);
	else for (; n < t.length;) e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
//#endregion
//#region node_modules/micromark-util-subtokenize/index.js
function Dn(e) {
	let t = {}, n = -1, r, i, a, o, s, c, l, u = new Tn(e);
	for (; ++n < u.length;) {
		for (; n in t;) n = t[n];
		if (r = u.get(n), n && r[1].type === "chunkFlow" && u.get(n - 1)[1].type === "listItemPrefix" && (c = r[1]._tokenizer.events, a = 0, a < c.length && c[a][1].type === "lineEndingBlank" && (a += 2), a < c.length && c[a][1].type === "content")) for (; ++a < c.length && c[a][1].type !== "content";) c[a][1].type === "chunkText" && (c[a][1]._isInFirstContentOfListItem = !0, a++);
		if (r[0] === "enter") r[1].contentType && (Object.assign(t, On(u, n)), n = t[n], l = !0);
		else if (r[1]._container) {
			for (a = n, i = void 0; a--;) if (o = u.get(a), o[1].type === "lineEnding" || o[1].type === "lineEndingBlank") o[0] === "enter" && (i && (u.get(i)[1].type = "lineEndingBlank"), o[1].type = "lineEnding", i = a);
			else if (!(o[1].type === "linePrefix" || o[1].type === "listItemIndent")) break;
			i && (r[1].end = { ...u.get(i)[1].start }, s = u.slice(i, n), s.unshift(r), u.splice(i, n - i + 1, s));
		}
	}
	return Tt(e, 0, Infinity, u.slice(0)), !l;
}
function On(e, t) {
	let n = e.get(t)[1], r = e.get(t)[2], i = t - 1, a = [], o = n._tokenizer;
	o || (o = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
	let s = o.events, c = [], l = {}, u, d, f = -1, p = n, m = 0, h = 0, g = [h];
	for (; p;) {
		for (; e.get(++i)[1] !== p;);
		a.push(i), p._tokenizer || (u = r.sliceStream(p), p.next || u.push(null), d && o.defineSkip(p.start), p._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0), o.write(u), p._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)), d = p, p = p.next;
	}
	for (p = n; ++f < s.length;) s[f][0] === "exit" && s[f - 1][0] === "enter" && s[f][1].type === s[f - 1][1].type && s[f][1].start.line !== s[f][1].end.line && (h = f + 1, g.push(h), p._tokenizer = void 0, p.previous = void 0, p = p.next);
	for (o.events = [], p ? (p._tokenizer = void 0, p.previous = void 0) : g.pop(), f = g.length; f--;) {
		let t = s.slice(g[f], g[f + 1]), n = a.pop();
		c.push([n, n + t.length - 1]), e.splice(n, 2, t);
	}
	for (c.reverse(), f = -1; ++f < c.length;) l[m + c[f][0]] = m + c[f][1], m += c[f][1] - c[f][0] - 1;
	return l;
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/content.js
var kn = {
	resolve: jn,
	tokenize: Mn
}, An = {
	partial: !0,
	tokenize: Nn
};
function jn(e) {
	return Dn(e), e;
}
function Mn(e, t) {
	let n;
	return r;
	function r(t) {
		return e.enter("content"), n = e.enter("chunkContent", { contentType: "content" }), i(t);
	}
	function i(t) {
		return t === null ? a(t) : U(t) ? e.check(An, o, a)(t) : (e.consume(t), i);
	}
	function a(n) {
		return e.exit("chunkContent"), e.exit("content"), t(n);
	}
	function o(t) {
		return e.consume(t), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
			contentType: "content",
			previous: n
		}), n = n.next, i;
	}
}
function Nn(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), K(e, a, "linePrefix");
	}
	function a(i) {
		if (i === null || U(i)) return n(i);
		let a = r.events[r.events.length - 1];
		return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(i) : e.interrupt(r.parser.constructs.flow, n, t)(i);
	}
}
//#endregion
//#region node_modules/micromark-factory-destination/index.js
function Pn(e, t, n, r, i, a, o, s, c) {
	let l = c || Infinity, u = 0;
	return d;
	function d(t) {
		return t === 60 ? (e.enter(r), e.enter(i), e.enter(a), e.consume(t), e.exit(a), f) : t === null || t === 32 || t === 41 || Pt(t) ? n(t) : (e.enter(r), e.enter(o), e.enter(s), e.enter("chunkString", { contentType: "string" }), h(t));
	}
	function f(n) {
		return n === 62 ? (e.enter(a), e.consume(n), e.exit(a), e.exit(i), e.exit(r), t) : (e.enter(s), e.enter("chunkString", { contentType: "string" }), p(n));
	}
	function p(t) {
		return t === 62 ? (e.exit("chunkString"), e.exit(s), f(t)) : t === null || t === 60 || U(t) ? n(t) : (e.consume(t), t === 92 ? m : p);
	}
	function m(t) {
		return t === 60 || t === 62 || t === 92 ? (e.consume(t), p) : p(t);
	}
	function h(i) {
		return !u && (i === null || i === 41 || W(i)) ? (e.exit("chunkString"), e.exit(s), e.exit(o), e.exit(r), t(i)) : u < l && i === 40 ? (e.consume(i), u++, h) : i === 41 ? (e.consume(i), u--, h) : i === null || i === 32 || i === 40 || Pt(i) ? n(i) : (e.consume(i), i === 92 ? g : h);
	}
	function g(t) {
		return t === 40 || t === 41 || t === 92 ? (e.consume(t), h) : h(t);
	}
}
//#endregion
//#region node_modules/micromark-factory-label/index.js
function Fn(e, t, n, r, i, a) {
	let o = this, s = 0, c;
	return l;
	function l(t) {
		return e.enter(r), e.enter(i), e.consume(t), e.exit(i), e.enter(a), u;
	}
	function u(l) {
		return s > 999 || l === null || l === 91 || l === 93 && !c || l === 94 && !s && "_hiddenFootnoteSupport" in o.parser.constructs ? n(l) : l === 93 ? (e.exit(a), e.enter(i), e.consume(l), e.exit(i), e.exit(r), t) : U(l) ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), u) : (e.enter("chunkString", { contentType: "string" }), d(l));
	}
	function d(t) {
		return t === null || t === 91 || t === 93 || U(t) || s++ > 999 ? (e.exit("chunkString"), u(t)) : (e.consume(t), c ||= !G(t), t === 92 ? f : d);
	}
	function f(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), s++, d) : d(t);
	}
}
//#endregion
//#region node_modules/micromark-factory-title/index.js
function In(e, t, n, r, i, a) {
	let o;
	return s;
	function s(t) {
		return t === 34 || t === 39 || t === 40 ? (e.enter(r), e.enter(i), e.consume(t), e.exit(i), o = t === 40 ? 41 : t, c) : n(t);
	}
	function c(n) {
		return n === o ? (e.enter(i), e.consume(n), e.exit(i), e.exit(r), t) : (e.enter(a), l(n));
	}
	function l(t) {
		return t === o ? (e.exit(a), c(o)) : t === null ? n(t) : U(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), K(e, l, "linePrefix")) : (e.enter("chunkString", { contentType: "string" }), u(t));
	}
	function u(t) {
		return t === o || t === null || U(t) ? (e.exit("chunkString"), l(t)) : (e.consume(t), t === 92 ? d : u);
	}
	function d(t) {
		return t === o || t === 92 ? (e.consume(t), u) : u(t);
	}
}
//#endregion
//#region node_modules/micromark-factory-whitespace/index.js
function Ln(e, t) {
	let n;
	return r;
	function r(i) {
		return U(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : G(i) ? K(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/definition.js
var Rn = {
	name: "definition",
	tokenize: Bn
}, zn = {
	partial: !0,
	tokenize: Vn
};
function Bn(e, t, n) {
	let r = this, i;
	return a;
	function a(t) {
		return e.enter("definition"), o(t);
	}
	function o(t) {
		return Fn.call(r, e, s, n, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(t);
	}
	function s(t) {
		return i = Mt(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), t === 58 ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), c) : n(t);
	}
	function c(t) {
		return W(t) ? Ln(e, l)(t) : l(t);
	}
	function l(t) {
		return Pn(e, u, n, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(t);
	}
	function u(t) {
		return e.attempt(zn, d, d)(t);
	}
	function d(t) {
		return G(t) ? K(e, f, "whitespace")(t) : f(t);
	}
	function f(a) {
		return a === null || U(a) ? (e.exit("definition"), r.parser.defined.push(i), t(a)) : n(a);
	}
}
function Vn(e, t, n) {
	return r;
	function r(t) {
		return W(t) ? Ln(e, i)(t) : n(t);
	}
	function i(t) {
		return In(e, a, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(t);
	}
	function a(t) {
		return G(t) ? K(e, o, "whitespace")(t) : o(t);
	}
	function o(e) {
		return e === null || U(e) ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/hard-break-escape.js
var Hn = {
	name: "hardBreakEscape",
	tokenize: Un
};
function Un(e, t, n) {
	return r;
	function r(t) {
		return e.enter("hardBreakEscape"), e.consume(t), i;
	}
	function i(r) {
		return U(r) ? (e.exit("hardBreakEscape"), t(r)) : n(r);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/heading-atx.js
var Wn = {
	name: "headingAtx",
	resolve: Gn,
	tokenize: Kn
};
function Gn(e, t) {
	let n = e.length - 2, r = 3, i, a;
	return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
		type: "atxHeadingText",
		start: e[r][1].start,
		end: e[n][1].end
	}, a = {
		type: "chunkText",
		start: e[r][1].start,
		end: e[n][1].end,
		contentType: "text"
	}, Tt(e, r, n - r + 1, [
		[
			"enter",
			i,
			t
		],
		[
			"enter",
			a,
			t
		],
		[
			"exit",
			a,
			t
		],
		[
			"exit",
			i,
			t
		]
	])), e;
}
function Kn(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return e.enter("atxHeading"), a(t);
	}
	function a(t) {
		return e.enter("atxHeadingSequence"), o(t);
	}
	function o(t) {
		return t === 35 && r++ < 6 ? (e.consume(t), o) : t === null || W(t) ? (e.exit("atxHeadingSequence"), s(t)) : n(t);
	}
	function s(n) {
		return n === 35 ? (e.enter("atxHeadingSequence"), c(n)) : n === null || U(n) ? (e.exit("atxHeading"), t(n)) : G(n) ? K(e, s, "whitespace")(n) : (e.enter("atxHeadingText"), l(n));
	}
	function c(t) {
		return t === 35 ? (e.consume(t), c) : (e.exit("atxHeadingSequence"), s(t));
	}
	function l(t) {
		return t === null || t === 35 || W(t) ? (e.exit("atxHeadingText"), s(t)) : (e.consume(t), l);
	}
}
//#endregion
//#region node_modules/micromark-util-html-tag-name/index.js
var qn = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), Jn = [
	"pre",
	"script",
	"style",
	"textarea"
], Yn = {
	concrete: !0,
	name: "htmlFlow",
	resolveTo: Qn,
	tokenize: $n
}, Xn = {
	partial: !0,
	tokenize: tr
}, Zn = {
	partial: !0,
	tokenize: er
};
function Qn(e) {
	let t = e.length;
	for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"););
	return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function $n(e, t, n) {
	let r = this, i, a, o, s, c;
	return l;
	function l(e) {
		return u(e);
	}
	function u(t) {
		return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(t), d;
	}
	function d(s) {
		return s === 33 ? (e.consume(s), f) : s === 47 ? (e.consume(s), a = !0, h) : s === 63 ? (e.consume(s), i = 3, r.interrupt ? t : re) : V(s) ? (e.consume(s), o = String.fromCharCode(s), g) : n(s);
	}
	function f(a) {
		return a === 45 ? (e.consume(a), i = 2, p) : a === 91 ? (e.consume(a), i = 5, s = 0, m) : V(a) ? (e.consume(a), i = 4, r.interrupt ? t : re) : n(a);
	}
	function p(i) {
		return i === 45 ? (e.consume(i), r.interrupt ? t : re) : n(i);
	}
	function m(i) {
		return i === "CDATA[".charCodeAt(s++) ? (e.consume(i), s === 6 ? r.interrupt ? t : O : m) : n(i);
	}
	function h(t) {
		return V(t) ? (e.consume(t), o = String.fromCharCode(t), g) : n(t);
	}
	function g(s) {
		if (s === null || s === 47 || s === 62 || W(s)) {
			let c = s === 47, l = o.toLowerCase();
			return !c && !a && Jn.includes(l) ? (i = 1, r.interrupt ? t(s) : O(s)) : qn.includes(o.toLowerCase()) ? (i = 6, c ? (e.consume(s), _) : r.interrupt ? t(s) : O(s)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(s) : a ? v(s) : y(s));
		}
		return s === 45 || H(s) ? (e.consume(s), o += String.fromCharCode(s), g) : n(s);
	}
	function _(i) {
		return i === 62 ? (e.consume(i), r.interrupt ? t : O) : n(i);
	}
	function v(t) {
		return G(t) ? (e.consume(t), v) : E(t);
	}
	function y(t) {
		return t === 47 ? (e.consume(t), E) : t === 58 || t === 95 || V(t) ? (e.consume(t), b) : G(t) ? (e.consume(t), y) : E(t);
	}
	function b(t) {
		return t === 45 || t === 46 || t === 58 || t === 95 || H(t) ? (e.consume(t), b) : x(t);
	}
	function x(t) {
		return t === 61 ? (e.consume(t), S) : G(t) ? (e.consume(t), x) : y(t);
	}
	function S(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 34 || t === 39 ? (e.consume(t), c = t, C) : G(t) ? (e.consume(t), S) : w(t);
	}
	function C(t) {
		return t === c ? (e.consume(t), c = null, T) : t === null || U(t) ? n(t) : (e.consume(t), C);
	}
	function w(t) {
		return t === null || t === 34 || t === 39 || t === 47 || t === 60 || t === 61 || t === 62 || t === 96 || W(t) ? x(t) : (e.consume(t), w);
	}
	function T(e) {
		return e === 47 || e === 62 || G(e) ? y(e) : n(e);
	}
	function E(t) {
		return t === 62 ? (e.consume(t), D) : n(t);
	}
	function D(t) {
		return t === null || U(t) ? O(t) : G(t) ? (e.consume(t), D) : n(t);
	}
	function O(t) {
		return t === 45 && i === 2 ? (e.consume(t), te) : t === 60 && i === 1 ? (e.consume(t), j) : t === 62 && i === 4 ? (e.consume(t), N) : t === 63 && i === 3 ? (e.consume(t), re) : t === 93 && i === 5 ? (e.consume(t), ne) : U(t) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(Xn, P, k)(t)) : t === null || U(t) ? (e.exit("htmlFlowData"), k(t)) : (e.consume(t), O);
	}
	function k(t) {
		return e.check(Zn, ee, P)(t);
	}
	function ee(t) {
		return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), A;
	}
	function A(t) {
		return t === null || U(t) ? k(t) : (e.enter("htmlFlowData"), O(t));
	}
	function te(t) {
		return t === 45 ? (e.consume(t), re) : O(t);
	}
	function j(t) {
		return t === 47 ? (e.consume(t), o = "", M) : O(t);
	}
	function M(t) {
		if (t === 62) {
			let n = o.toLowerCase();
			return Jn.includes(n) ? (e.consume(t), N) : O(t);
		}
		return V(t) && o.length < 8 ? (e.consume(t), o += String.fromCharCode(t), M) : O(t);
	}
	function ne(t) {
		return t === 93 ? (e.consume(t), re) : O(t);
	}
	function re(t) {
		return t === 62 ? (e.consume(t), N) : t === 45 && i === 2 ? (e.consume(t), re) : O(t);
	}
	function N(t) {
		return t === null || U(t) ? (e.exit("htmlFlowData"), P(t)) : (e.consume(t), N);
	}
	function P(n) {
		return e.exit("htmlFlow"), t(n);
	}
}
function er(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return U(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), a) : n(t);
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
function tr(e, t, n) {
	return r;
	function r(r) {
		return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), e.attempt(nn, t, n);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/html-text.js
var nr = {
	name: "htmlText",
	tokenize: rr
};
function rr(e, t, n) {
	let r = this, i, a, o;
	return s;
	function s(t) {
		return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(t), c;
	}
	function c(t) {
		return t === 33 ? (e.consume(t), l) : t === 47 ? (e.consume(t), x) : t === 63 ? (e.consume(t), y) : V(t) ? (e.consume(t), w) : n(t);
	}
	function l(t) {
		return t === 45 ? (e.consume(t), u) : t === 91 ? (e.consume(t), a = 0, m) : V(t) ? (e.consume(t), v) : n(t);
	}
	function u(t) {
		return t === 45 ? (e.consume(t), p) : n(t);
	}
	function d(t) {
		return t === null ? n(t) : t === 45 ? (e.consume(t), f) : U(t) ? (o = d, j(t)) : (e.consume(t), d);
	}
	function f(t) {
		return t === 45 ? (e.consume(t), p) : d(t);
	}
	function p(e) {
		return e === 62 ? te(e) : e === 45 ? f(e) : d(e);
	}
	function m(t) {
		return t === "CDATA[".charCodeAt(a++) ? (e.consume(t), a === 6 ? h : m) : n(t);
	}
	function h(t) {
		return t === null ? n(t) : t === 93 ? (e.consume(t), g) : U(t) ? (o = h, j(t)) : (e.consume(t), h);
	}
	function g(t) {
		return t === 93 ? (e.consume(t), _) : h(t);
	}
	function _(t) {
		return t === 62 ? te(t) : t === 93 ? (e.consume(t), _) : h(t);
	}
	function v(t) {
		return t === null || t === 62 ? te(t) : U(t) ? (o = v, j(t)) : (e.consume(t), v);
	}
	function y(t) {
		return t === null ? n(t) : t === 63 ? (e.consume(t), b) : U(t) ? (o = y, j(t)) : (e.consume(t), y);
	}
	function b(e) {
		return e === 62 ? te(e) : y(e);
	}
	function x(t) {
		return V(t) ? (e.consume(t), S) : n(t);
	}
	function S(t) {
		return t === 45 || H(t) ? (e.consume(t), S) : C(t);
	}
	function C(t) {
		return U(t) ? (o = C, j(t)) : G(t) ? (e.consume(t), C) : te(t);
	}
	function w(t) {
		return t === 45 || H(t) ? (e.consume(t), w) : t === 47 || t === 62 || W(t) ? T(t) : n(t);
	}
	function T(t) {
		return t === 47 ? (e.consume(t), te) : t === 58 || t === 95 || V(t) ? (e.consume(t), E) : U(t) ? (o = T, j(t)) : G(t) ? (e.consume(t), T) : te(t);
	}
	function E(t) {
		return t === 45 || t === 46 || t === 58 || t === 95 || H(t) ? (e.consume(t), E) : D(t);
	}
	function D(t) {
		return t === 61 ? (e.consume(t), O) : U(t) ? (o = D, j(t)) : G(t) ? (e.consume(t), D) : T(t);
	}
	function O(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 34 || t === 39 ? (e.consume(t), i = t, k) : U(t) ? (o = O, j(t)) : G(t) ? (e.consume(t), O) : (e.consume(t), ee);
	}
	function k(t) {
		return t === i ? (e.consume(t), i = void 0, A) : t === null ? n(t) : U(t) ? (o = k, j(t)) : (e.consume(t), k);
	}
	function ee(t) {
		return t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 96 ? n(t) : t === 47 || t === 62 || W(t) ? T(t) : (e.consume(t), ee);
	}
	function A(e) {
		return e === 47 || e === 62 || W(e) ? T(e) : n(e);
	}
	function te(r) {
		return r === 62 ? (e.consume(r), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(r);
	}
	function j(t) {
		return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), M;
	}
	function M(t) {
		return G(t) ? K(e, ne, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : ne(t);
	}
	function ne(t) {
		return e.enter("htmlTextData"), o(t);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-end.js
var ir = {
	name: "labelEnd",
	resolveAll: cr,
	resolveTo: lr,
	tokenize: ur
}, ar = { tokenize: dr }, or = { tokenize: fr }, sr = { tokenize: pr };
function cr(e) {
	let t = -1, n = [];
	for (; ++t < e.length;) {
		let r = e[t][1];
		if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
			let e = r.type === "labelImage" ? 4 : 2;
			r.type = "data", t += e;
		}
	}
	return e.length !== n.length && Tt(e, 0, e.length, n), e;
}
function lr(e, t) {
	let n = e.length, r = 0, i, a, o, s;
	for (; n--;) if (i = e[n][1], a) {
		if (i.type === "link" || i.type === "labelLink" && i._inactive) break;
		e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
	} else if (o) {
		if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (a = n, i.type !== "labelLink")) {
			r = 2;
			break;
		}
	} else i.type === "labelEnd" && (o = n);
	let c = {
		type: e[a][1].type === "labelLink" ? "link" : "image",
		start: { ...e[a][1].start },
		end: { ...e[e.length - 1][1].end }
	}, l = {
		type: "label",
		start: { ...e[a][1].start },
		end: { ...e[o][1].end }
	}, u = {
		type: "labelText",
		start: { ...e[a + r + 2][1].end },
		end: { ...e[o - 2][1].start }
	};
	return s = [[
		"enter",
		c,
		t
	], [
		"enter",
		l,
		t
	]], s = Et(s, e.slice(a + 1, a + r + 3)), s = Et(s, [[
		"enter",
		u,
		t
	]]), s = Et(s, Yt(t.parser.constructs.insideSpan.null, e.slice(a + r + 4, o - 3), t)), s = Et(s, [
		[
			"exit",
			u,
			t
		],
		e[o - 2],
		e[o - 1],
		[
			"exit",
			l,
			t
		]
	]), s = Et(s, e.slice(o + 1)), s = Et(s, [[
		"exit",
		c,
		t
	]]), Tt(e, a, e.length, s), e;
}
function ur(e, t, n) {
	let r = this, i = r.events.length, a, o;
	for (; i--;) if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
		a = r.events[i][1];
		break;
	}
	return s;
	function s(t) {
		return a ? a._inactive ? d(t) : (o = r.parser.defined.includes(Mt(r.sliceSerialize({
			start: a.end,
			end: r.now()
		}))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelEnd"), c) : n(t);
	}
	function c(t) {
		return t === 40 ? e.attempt(ar, u, o ? u : d)(t) : t === 91 ? e.attempt(or, u, o ? l : d)(t) : o ? u(t) : d(t);
	}
	function l(t) {
		return e.attempt(sr, u, d)(t);
	}
	function u(e) {
		return t(e);
	}
	function d(e) {
		return a._balanced = !0, n(e);
	}
}
function dr(e, t, n) {
	return r;
	function r(t) {
		return e.enter("resource"), e.enter("resourceMarker"), e.consume(t), e.exit("resourceMarker"), i;
	}
	function i(t) {
		return W(t) ? Ln(e, a)(t) : a(t);
	}
	function a(t) {
		return t === 41 ? u(t) : Pn(e, o, s, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(t);
	}
	function o(t) {
		return W(t) ? Ln(e, c)(t) : u(t);
	}
	function s(e) {
		return n(e);
	}
	function c(t) {
		return t === 34 || t === 39 || t === 40 ? In(e, l, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(t) : u(t);
	}
	function l(t) {
		return W(t) ? Ln(e, u)(t) : u(t);
	}
	function u(r) {
		return r === 41 ? (e.enter("resourceMarker"), e.consume(r), e.exit("resourceMarker"), e.exit("resource"), t) : n(r);
	}
}
function fr(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return Fn.call(r, e, a, o, "reference", "referenceMarker", "referenceString")(t);
	}
	function a(e) {
		return r.parser.defined.includes(Mt(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(e) : n(e);
	}
	function o(e) {
		return n(e);
	}
}
function pr(e, t, n) {
	return r;
	function r(t) {
		return e.enter("reference"), e.enter("referenceMarker"), e.consume(t), e.exit("referenceMarker"), i;
	}
	function i(r) {
		return r === 93 ? (e.enter("referenceMarker"), e.consume(r), e.exit("referenceMarker"), e.exit("reference"), t) : n(r);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-start-image.js
var mr = {
	name: "labelStartImage",
	resolveAll: ir.resolveAll,
	tokenize: hr
};
function hr(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(t), e.exit("labelImageMarker"), a;
	}
	function a(t) {
		return t === 91 ? (e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelImage"), o) : n(t);
	}
	function o(e) {
		/* c8 ignore next 3 */
		return e === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-start-link.js
var gr = {
	name: "labelStartLink",
	resolveAll: ir.resolveAll,
	tokenize: _r
};
function _r(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("labelLink"), e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelLink"), a;
	}
	function a(e) {
		/* c8 ignore next 3 */
		return e === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/line-ending.js
var vr = {
	name: "lineEnding",
	tokenize: yr
};
function yr(e, t) {
	return n;
	function n(n) {
		return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), K(e, t, "linePrefix");
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/thematic-break.js
var br = {
	name: "thematicBreak",
	tokenize: xr
};
function xr(e, t, n) {
	let r = 0, i;
	return a;
	function a(t) {
		return e.enter("thematicBreak"), o(t);
	}
	function o(e) {
		return i = e, s(e);
	}
	function s(a) {
		return a === i ? (e.enter("thematicBreakSequence"), c(a)) : r >= 3 && (a === null || U(a)) ? (e.exit("thematicBreak"), t(a)) : n(a);
	}
	function c(t) {
		return t === i ? (e.consume(t), r++, c) : (e.exit("thematicBreakSequence"), G(t) ? K(e, s, "whitespace")(t) : s(t));
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/list.js
var q = {
	continuation: { tokenize: Tr },
	exit: Dr,
	name: "list",
	tokenize: wr
}, Sr = {
	partial: !0,
	tokenize: Or
}, Cr = {
	partial: !0,
	tokenize: Er
};
function wr(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0;
	return s;
	function s(t) {
		let i = r.containerState.type || (t === 42 || t === 43 || t === 45 ? "listUnordered" : "listOrdered");
		if (i === "listUnordered" ? !r.containerState.marker || t === r.containerState.marker : Ft(t)) {
			if (r.containerState.type || (r.containerState.type = i, e.enter(i, { _container: !0 })), i === "listUnordered") return e.enter("listItemPrefix"), t === 42 || t === 45 ? e.check(br, n, l)(t) : l(t);
			if (!r.interrupt || t === 49) return e.enter("listItemPrefix"), e.enter("listItemValue"), c(t);
		}
		return n(t);
	}
	function c(t) {
		return Ft(t) && ++o < 10 ? (e.consume(t), c) : (!r.interrupt || o < 2) && (r.containerState.marker ? t === r.containerState.marker : t === 41 || t === 46) ? (e.exit("listItemValue"), l(t)) : n(t);
	}
	function l(t) {
		return e.enter("listItemMarker"), e.consume(t), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || t, e.check(nn, r.interrupt ? n : u, e.attempt(Sr, f, d));
	}
	function u(e) {
		return r.containerState.initialBlankLine = !0, a++, f(e);
	}
	function d(t) {
		return G(t) ? (e.enter("listItemPrefixWhitespace"), e.consume(t), e.exit("listItemPrefixWhitespace"), f) : n(t);
	}
	function f(n) {
		return r.containerState.size = a + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(n);
	}
}
function Tr(e, t, n) {
	let r = this;
	return r.containerState._closeFlow = void 0, e.check(nn, i, a);
	function i(n) {
		return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, K(e, t, "listItemIndent", r.containerState.size + 1)(n);
	}
	function a(n) {
		return r.containerState.furtherBlankLines || !G(n) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, o(n)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(Cr, t, o)(n));
	}
	function o(i) {
		return r.containerState._closeFlow = !0, r.interrupt = void 0, K(e, e.attempt(q, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(i);
	}
}
function Er(e, t, n) {
	let r = this;
	return K(e, i, "listItemIndent", r.containerState.size + 1);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return i && i[1].type === "listItemIndent" && i[2].sliceSerialize(i[1], !0).length === r.containerState.size ? t(e) : n(e);
	}
}
function Dr(e) {
	e.exit(this.containerState.type);
}
function Or(e, t, n) {
	let r = this;
	return K(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return !G(e) && i && i[1].type === "listItemPrefixWhitespace" ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/setext-underline.js
var kr = {
	name: "setextUnderline",
	resolveTo: Ar,
	tokenize: jr
};
function Ar(e, t) {
	let n = e.length, r, i, a;
	for (; n--;) if (e[n][0] === "enter") {
		if (e[n][1].type === "content") {
			r = n;
			break;
		}
		e[n][1].type === "paragraph" && (i = n);
	} else e[n][1].type === "content" && e.splice(n, 1), !a && e[n][1].type === "definition" && (a = n);
	let o = {
		type: "setextHeading",
		start: { ...e[r][1].start },
		end: { ...e[e.length - 1][1].end }
	};
	return e[i][1].type = "setextHeadingText", a ? (e.splice(i, 0, [
		"enter",
		o,
		t
	]), e.splice(a + 1, 0, [
		"exit",
		e[r][1],
		t
	]), e[r][1].end = { ...e[a][1].end }) : e[r][1] = o, e.push([
		"exit",
		o,
		t
	]), e;
}
function jr(e, t, n) {
	let r = this, i;
	return a;
	function a(t) {
		let a = r.events.length, s;
		for (; a--;) if (r.events[a][1].type !== "lineEnding" && r.events[a][1].type !== "linePrefix" && r.events[a][1].type !== "content") {
			s = r.events[a][1].type === "paragraph";
			break;
		}
		return !r.parser.lazy[r.now().line] && (r.interrupt || s) ? (e.enter("setextHeadingLine"), i = t, o(t)) : n(t);
	}
	function o(t) {
		return e.enter("setextHeadingLineSequence"), s(t);
	}
	function s(t) {
		return t === i ? (e.consume(t), s) : (e.exit("setextHeadingLineSequence"), G(t) ? K(e, c, "lineSuffix")(t) : c(t));
	}
	function c(r) {
		return r === null || U(r) ? (e.exit("setextHeadingLine"), t(r)) : n(r);
	}
}
//#endregion
//#region node_modules/micromark/lib/initialize/flow.js
var Mr = { tokenize: Nr };
function Nr(e) {
	let t = this, n = e.attempt(nn, r, e.attempt(this.parser.constructs.flowInitial, i, K(e, e.attempt(this.parser.constructs.flow, i, e.attempt(kn, i)), "linePrefix")));
	return n;
	function r(r) {
		if (r === null) {
			e.consume(r);
			return;
		}
		return e.enter("lineEndingBlank"), e.consume(r), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
	}
	function i(r) {
		if (r === null) {
			e.consume(r);
			return;
		}
		return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), t.currentConstruct = void 0, n;
	}
}
//#endregion
//#region node_modules/micromark/lib/initialize/text.js
var Pr = { resolveAll: Rr() }, Fr = Lr("string"), Ir = Lr("text");
function Lr(e) {
	return {
		resolveAll: Rr(e === "text" ? zr : void 0),
		tokenize: t
	};
	function t(t) {
		let n = this, r = this.parser.constructs[e], i = t.attempt(r, a, o);
		return a;
		function a(e) {
			return c(e) ? i(e) : o(e);
		}
		function o(e) {
			if (e === null) {
				t.consume(e);
				return;
			}
			return t.enter("data"), t.consume(e), s;
		}
		function s(e) {
			return c(e) ? (t.exit("data"), i(e)) : (t.consume(e), s);
		}
		function c(e) {
			if (e === null) return !0;
			let t = r[e], i = -1;
			if (t) for (; ++i < t.length;) {
				let e = t[i];
				if (!e.previous || e.previous.call(n, n.previous)) return !0;
			}
			return !1;
		}
	}
}
function Rr(e) {
	return t;
	function t(t, n) {
		let r = -1, i;
		for (; ++r <= t.length;) i === void 0 ? t[r] && t[r][1].type === "data" && (i = r, r++) : (!t[r] || t[r][1].type !== "data") && (r !== i + 2 && (t[i][1].end = t[r - 1][1].end, t.splice(i + 2, r - i - 2), r = i + 2), i = void 0);
		return e ? e(t, n) : t;
	}
}
function zr(e, t) {
	let n = 0;
	for (; ++n <= e.length;) if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
		let r = e[n - 1][1], i = t.sliceStream(r), a = i.length, o = -1, s = 0, c;
		for (; a--;) {
			let e = i[a];
			if (typeof e == "string") {
				for (o = e.length; e.charCodeAt(o - 1) === 32;) s++, o--;
				if (o) break;
				o = -1;
			} else if (e === -2) c = !0, s++;
			else if (e !== -1) {
				a++;
				break;
			}
		}
		if (t._contentTypeTextTrailing && n === e.length && (s = 0), s) {
			let i = {
				type: n === e.length || c || s < 2 ? "lineSuffix" : "hardBreakTrailing",
				start: {
					_bufferIndex: a ? o : r.start._bufferIndex + o,
					_index: r.start._index + a,
					line: r.end.line,
					column: r.end.column - s,
					offset: r.end.offset - s
				},
				end: { ...r.end }
			};
			r.end = { ...i.start }, r.start.offset === r.end.offset ? Object.assign(r, i) : (e.splice(n, 0, [
				"enter",
				i,
				t
			], [
				"exit",
				i,
				t
			]), n += 2);
		}
		n++;
	}
	return e;
}
//#endregion
//#region node_modules/micromark/lib/constructs.js
var Br = /* @__PURE__ */ s({
	attentionMarkers: () => Jr,
	contentInitial: () => Hr,
	disable: () => Yr,
	document: () => Vr,
	flow: () => Wr,
	flowInitial: () => Ur,
	insideSpan: () => qr,
	string: () => Gr,
	text: () => Kr
}), Vr = {
	42: q,
	43: q,
	45: q,
	48: q,
	49: q,
	50: q,
	51: q,
	52: q,
	53: q,
	54: q,
	55: q,
	56: q,
	57: q,
	62: an
}, Hr = { 91: Rn }, Ur = {
	[-2]: _n,
	[-1]: _n,
	32: _n
}, Wr = {
	35: Wn,
	42: br,
	45: [kr, br],
	60: Yn,
	61: kr,
	95: br,
	96: mn,
	126: mn
}, Gr = {
	38: dn,
	92: ln
}, Kr = {
	[-5]: vr,
	[-4]: vr,
	[-3]: vr,
	33: mr,
	38: dn,
	42: Xt,
	60: [en, nr],
	91: gr,
	92: [Hn, ln],
	93: ir,
	95: Xt,
	96: xn
}, qr = { null: [Xt, Pr] }, Jr = { null: [42, 95] }, Yr = { null: [] };
//#endregion
//#region node_modules/micromark/lib/create-tokenizer.js
function Xr(e, t, n) {
	let r = {
		_bufferIndex: -1,
		_index: 0,
		line: n && n.line || 1,
		column: n && n.column || 1,
		offset: n && n.offset || 0
	}, i = {}, a = [], o = [], s = [], c = {
		attempt: C(x),
		check: C(S),
		consume: v,
		enter: y,
		exit: b,
		interrupt: C(S, { interrupt: !0 })
	}, l = {
		code: null,
		containerState: {},
		defineSkip: h,
		events: [],
		now: m,
		parser: e,
		previous: null,
		sliceSerialize: f,
		sliceStream: p,
		write: d
	}, u = t.tokenize.call(l, c);
	return t.resolveAll && a.push(t), l;
	function d(e) {
		return o = Et(o, e), g(), o[o.length - 1] === null ? (w(t, 0), l.events = Yt(a, l.events, l), l.events) : [];
	}
	function f(e, t) {
		return Qr(p(e), t);
	}
	function p(e) {
		return Zr(o, e);
	}
	function m() {
		let { _bufferIndex: e, _index: t, line: n, column: i, offset: a } = r;
		return {
			_bufferIndex: e,
			_index: t,
			line: n,
			column: i,
			offset: a
		};
	}
	function h(e) {
		i[e.line] = e.column, E();
	}
	function g() {
		let e;
		for (; r._index < o.length;) {
			let t = o[r._index];
			if (typeof t == "string") for (e = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === e && r._bufferIndex < t.length;) _(t.charCodeAt(r._bufferIndex));
			else _(t);
		}
	}
	function _(e) {
		u = u(e);
	}
	function v(e) {
		U(e) ? (r.line++, r.column = 1, r.offset += e === -3 ? 2 : 1, E()) : e !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === o[r._index].length && (r._bufferIndex = -1, r._index++)), l.previous = e;
	}
	function y(e, t) {
		let n = t || {};
		return n.type = e, n.start = m(), l.events.push([
			"enter",
			n,
			l
		]), s.push(n), n;
	}
	function b(e) {
		let t = s.pop();
		return t.end = m(), l.events.push([
			"exit",
			t,
			l
		]), t;
	}
	function x(e, t) {
		w(e, t.from);
	}
	function S(e, t) {
		t.restore();
	}
	function C(e, t) {
		return n;
		function n(n, r, i) {
			let a, o, s, u;
			return Array.isArray(n) ? f(n) : "tokenize" in n ? f([n]) : d(n);
			function d(e) {
				return t;
				function t(t) {
					let n = t !== null && e[t], r = t !== null && e.null;
					return f([...Array.isArray(n) ? n : n ? [n] : [], ...Array.isArray(r) ? r : r ? [r] : []])(t);
				}
			}
			function f(e) {
				return a = e, o = 0, e.length === 0 ? i : p(e[o]);
			}
			function p(e) {
				return n;
				function n(n) {
					return u = T(), s = e, e.partial || (l.currentConstruct = e), e.name && l.parser.constructs.disable.null.includes(e.name) ? h(n) : e.tokenize.call(t ? Object.assign(Object.create(l), t) : l, c, m, h)(n);
				}
			}
			function m(t) {
				return e(s, u), r;
			}
			function h(e) {
				return u.restore(), ++o < a.length ? p(a[o]) : i;
			}
		}
	}
	function w(e, t) {
		e.resolveAll && !a.includes(e) && a.push(e), e.resolve && Tt(l.events, t, l.events.length - t, e.resolve(l.events.slice(t), l)), e.resolveTo && (l.events = e.resolveTo(l.events, l));
	}
	function T() {
		let e = m(), t = l.previous, n = l.currentConstruct, i = l.events.length, a = Array.from(s);
		return {
			from: i,
			restore: o
		};
		function o() {
			r = e, l.previous = t, l.currentConstruct = n, l.events.length = i, s = a, E();
		}
	}
	function E() {
		r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
	}
}
function Zr(e, t) {
	let n = t.start._index, r = t.start._bufferIndex, i = t.end._index, a = t.end._bufferIndex, o;
	if (n === i) o = [e[n].slice(r, a)];
	else {
		if (o = e.slice(n, i), r > -1) {
			let e = o[0];
			typeof e == "string" ? o[0] = e.slice(r) : o.shift();
		}
		a > 0 && o.push(e[i].slice(0, a));
	}
	return o;
}
function Qr(e, t) {
	let n = -1, r = [], i;
	for (; ++n < e.length;) {
		let a = e[n], o;
		if (typeof a == "string") o = a;
		else switch (a) {
			case -5:
				o = "\r";
				break;
			case -4:
				o = "\n";
				break;
			case -3:
				o = "\r\n";
				break;
			case -2:
				o = t ? " " : "	";
				break;
			case -1:
				if (!t && i) continue;
				o = " ";
				break;
			default: o = String.fromCharCode(a);
		}
		i = a === -2, r.push(o);
	}
	return r.join("");
}
//#endregion
//#region node_modules/micromark/lib/parse.js
function $r(e) {
	let t = {
		constructs: Ot([Br, ...(e || {}).extensions || []]),
		content: n(Ht),
		defined: [],
		document: n(Wt),
		flow: n(Mr),
		lazy: {},
		string: n(Fr),
		text: n(Ir)
	};
	return t;
	function n(e) {
		return n;
		function n(n) {
			return Xr(t, e, n);
		}
	}
}
//#endregion
//#region node_modules/micromark/lib/postprocess.js
function ei(e) {
	for (; !Dn(e););
	return e;
}
//#endregion
//#region node_modules/micromark/lib/preprocess.js
var ti = /[\0\t\n\r]/g;
function ni() {
	let e = 1, t = "", n = !0, r;
	return i;
	function i(i, a, o) {
		let s = [], c, l, u, d, f;
		for (i = t + (typeof i == "string" ? i.toString() : new TextDecoder(a || void 0).decode(i)), u = 0, t = "", n &&= (i.charCodeAt(0) === 65279 && u++, void 0); u < i.length;) {
			if (ti.lastIndex = u, c = ti.exec(i), d = c && c.index !== void 0 ? c.index : i.length, f = i.charCodeAt(d), !c) {
				t = i.slice(u);
				break;
			}
			if (f === 10 && u === d && r) s.push(-3), r = void 0;
			else switch (r &&= (s.push(-5), void 0), u < d && (s.push(i.slice(u, d)), e += d - u), f) {
				case 0:
					s.push(65533), e++;
					break;
				case 9:
					for (l = Math.ceil(e / 4) * 4, s.push(-2); e++ < l;) s.push(-1);
					break;
				case 10:
					s.push(-4), e = 1;
					break;
				default: r = !0, e = 1;
			}
			u = d + 1;
		}
		return o && (r && s.push(-5), t && s.push(t), s.push(null)), s;
	}
}
//#endregion
//#region node_modules/micromark-util-decode-string/index.js
var ri = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function ii(e) {
	return e.replace(ri, ai);
}
function ai(e, t, n) {
	if (t) return t;
	if (n.charCodeAt(0) === 35) {
		let e = n.charCodeAt(1), t = e === 120 || e === 88;
		return jt(n.slice(t ? 2 : 1), t ? 16 : 10);
	}
	return wt(n) || e;
}
//#endregion
//#region node_modules/mdast-util-from-markdown/lib/index.js
var oi = {}.hasOwnProperty;
function si(e, t, n) {
	return t && typeof t == "object" && (n = t, t = void 0), ci(n)(ei($r(n).document().write(ni()(e, t, !0))));
}
function ci(e) {
	let t = {
		transforms: [],
		canContainEols: [
			"emphasis",
			"fragment",
			"heading",
			"paragraph",
			"strong"
		],
		enter: {
			autolink: a(_e),
			autolinkProtocol: T,
			autolinkEmail: T,
			atxHeading: a(pe),
			blockQuote: a(ce),
			characterEscape: T,
			characterReference: T,
			codeFenced: a(le),
			codeFencedFenceInfo: o,
			codeFencedFenceMeta: o,
			codeIndented: a(le, o),
			codeText: a(ue, o),
			codeTextData: T,
			data: T,
			codeFlowValue: T,
			definition: a(de),
			definitionDestinationString: o,
			definitionLabelString: o,
			definitionTitleString: o,
			emphasis: a(fe),
			hardBreakEscape: a(me),
			hardBreakTrailing: a(me),
			htmlFlow: a(he, o),
			htmlFlowData: T,
			htmlText: a(he, o),
			htmlTextData: T,
			image: a(ge),
			label: o,
			link: a(_e),
			listItem: a(ye),
			listItemValue: f,
			listOrdered: a(ve, d),
			listUnordered: a(ve),
			paragraph: a(be),
			reference: ie,
			referenceString: o,
			resourceDestinationString: o,
			resourceTitleString: o,
			setextHeading: a(pe),
			strong: a(xe),
			thematicBreak: a(Ce)
		},
		exit: {
			atxHeading: c(),
			atxHeadingSequence: x,
			autolink: c(),
			autolinkEmail: se,
			autolinkProtocol: oe,
			blockQuote: c(),
			characterEscapeValue: E,
			characterReferenceMarkerHexadecimal: I,
			characterReferenceMarkerNumeric: I,
			characterReferenceValue: ae,
			characterReference: L,
			codeFenced: c(g),
			codeFencedFence: h,
			codeFencedFenceInfo: p,
			codeFencedFenceMeta: m,
			codeFlowValue: E,
			codeIndented: c(_),
			codeText: c(A),
			codeTextData: E,
			data: E,
			definition: c(),
			definitionDestinationString: b,
			definitionLabelString: v,
			definitionTitleString: y,
			emphasis: c(),
			hardBreakEscape: c(O),
			hardBreakTrailing: c(O),
			htmlFlow: c(k),
			htmlFlowData: E,
			htmlText: c(ee),
			htmlTextData: E,
			image: c(j),
			label: ne,
			labelText: M,
			lineEnding: D,
			link: c(te),
			listItem: c(),
			listOrdered: c(),
			listUnordered: c(),
			paragraph: c(),
			referenceString: F,
			resourceDestinationString: re,
			resourceTitleString: N,
			resource: P,
			setextHeading: c(w),
			setextHeadingLineSequence: C,
			setextHeadingText: S,
			strong: c(),
			thematicBreak: c()
		}
	};
	ui(t, (e || {}).mdastExtensions || []);
	let n = {};
	return r;
	function r(e) {
		let r = {
			type: "root",
			children: []
		}, a = {
			stack: [r],
			tokenStack: [],
			config: t,
			enter: s,
			exit: l,
			buffer: o,
			resume: u,
			data: n
		}, c = [], d = -1;
		for (; ++d < e.length;) (e[d][1].type === "listOrdered" || e[d][1].type === "listUnordered") && (e[d][0] === "enter" ? c.push(d) : d = i(e, c.pop(), d));
		for (d = -1; ++d < e.length;) {
			let n = t[e[d][0]];
			oi.call(n, e[d][1].type) && n[e[d][1].type].call(Object.assign({ sliceSerialize: e[d][2].sliceSerialize }, a), e[d][1]);
		}
		if (a.tokenStack.length > 0) {
			let e = a.tokenStack[a.tokenStack.length - 1];
			(e[1] || fi).call(a, void 0, e[0]);
		}
		for (r.position = {
			start: li(e.length > 0 ? e[0][1].start : {
				line: 1,
				column: 1,
				offset: 0
			}),
			end: li(e.length > 0 ? e[e.length - 2][1].end : {
				line: 1,
				column: 1,
				offset: 0
			})
		}, d = -1; ++d < t.transforms.length;) r = t.transforms[d](r) || r;
		return r;
	}
	function i(e, t, n) {
		let r = t - 1, i = -1, a = !1, o, s, c, l;
		for (; ++r <= n;) {
			let t = e[r];
			switch (t[1].type) {
				case "listUnordered":
				case "listOrdered":
				case "blockQuote":
					t[0] === "enter" ? i++ : i--, l = void 0;
					break;
				case "lineEndingBlank":
					t[0] === "enter" && (o && !l && !i && !c && (c = r), l = void 0);
					break;
				case "linePrefix":
				case "listItemValue":
				case "listItemMarker":
				case "listItemPrefix":
				case "listItemPrefixWhitespace": break;
				default: l = void 0;
			}
			if (!i && t[0] === "enter" && t[1].type === "listItemPrefix" || i === -1 && t[0] === "exit" && (t[1].type === "listUnordered" || t[1].type === "listOrdered")) {
				if (o) {
					let i = r;
					for (s = void 0; i--;) {
						let t = e[i];
						if (t[1].type === "lineEnding" || t[1].type === "lineEndingBlank") {
							if (t[0] === "exit") continue;
							s && (e[s][1].type = "lineEndingBlank", a = !0), t[1].type = "lineEnding", s = i;
						} else if (!(t[1].type === "linePrefix" || t[1].type === "blockQuotePrefix" || t[1].type === "blockQuotePrefixWhitespace" || t[1].type === "blockQuoteMarker" || t[1].type === "listItemIndent")) break;
					}
					c && (!s || c < s) && (o._spread = !0), o.end = Object.assign({}, s ? e[s][1].start : t[1].end), e.splice(s || r, 0, [
						"exit",
						o,
						t[2]
					]), r++, n++;
				}
				if (t[1].type === "listItemPrefix") {
					let i = {
						type: "listItem",
						_spread: !1,
						start: Object.assign({}, t[1].start),
						end: void 0
					};
					o = i, e.splice(r, 0, [
						"enter",
						i,
						t[2]
					]), r++, n++, c = void 0, l = !0;
				}
			}
		}
		return e[t][1]._spread = a, n;
	}
	function a(e, t) {
		return n;
		function n(n) {
			s.call(this, e(n), n), t && t.call(this, n);
		}
	}
	function o() {
		this.stack.push({
			type: "fragment",
			children: []
		});
	}
	function s(e, t, n) {
		this.stack[this.stack.length - 1].children.push(e), this.stack.push(e), this.tokenStack.push([t, n || void 0]), e.position = {
			start: li(t.start),
			end: void 0
		};
	}
	function c(e) {
		return t;
		function t(t) {
			e && e.call(this, t), l.call(this, t);
		}
	}
	function l(e, t) {
		let n = this.stack.pop(), r = this.tokenStack.pop();
		if (r) r[0].type !== e.type && (t ? t.call(this, e, r[0]) : (r[1] || fi).call(this, e, r[0]));
		else throw Error("Cannot close `" + e.type + "` (" + Le({
			start: e.start,
			end: e.end
		}) + "): it’s not open");
		n.position.end = li(e.end);
	}
	function u() {
		return yt(this.stack.pop());
	}
	function d() {
		this.data.expectingFirstListItemValue = !0;
	}
	function f(e) {
		if (this.data.expectingFirstListItemValue) {
			let t = this.stack[this.stack.length - 2];
			t.start = Number.parseInt(this.sliceSerialize(e), 10), this.data.expectingFirstListItemValue = void 0;
		}
	}
	function p() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.lang = e;
	}
	function m() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.meta = e;
	}
	function h() {
		this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
	}
	function g() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
	}
	function _() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e.replace(/(\r?\n|\r)$/g, "");
	}
	function v(e) {
		let t = this.resume(), n = this.stack[this.stack.length - 1];
		n.label = t, n.identifier = Mt(this.sliceSerialize(e)).toLowerCase();
	}
	function y() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.title = e;
	}
	function b() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.url = e;
	}
	function x(e) {
		let t = this.stack[this.stack.length - 1];
		t.depth ||= this.sliceSerialize(e).length;
	}
	function S() {
		this.data.setextHeadingSlurpLineEnding = !0;
	}
	function C(e) {
		let t = this.stack[this.stack.length - 1];
		t.depth = this.sliceSerialize(e).codePointAt(0) === 61 ? 1 : 2;
	}
	function w() {
		this.data.setextHeadingSlurpLineEnding = void 0;
	}
	function T(e) {
		let t = this.stack[this.stack.length - 1].children, n = t[t.length - 1];
		(!n || n.type !== "text") && (n = Se(), n.position = {
			start: li(e.start),
			end: void 0
		}, t.push(n)), this.stack.push(n);
	}
	function E(e) {
		let t = this.stack.pop();
		t.value += this.sliceSerialize(e), t.position.end = li(e.end);
	}
	function D(e) {
		let n = this.stack[this.stack.length - 1];
		if (this.data.atHardBreak) {
			let t = n.children[n.children.length - 1];
			t.position.end = li(e.end), this.data.atHardBreak = void 0;
			return;
		}
		!this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(n.type) && (T.call(this, e), E.call(this, e));
	}
	function O() {
		this.data.atHardBreak = !0;
	}
	function k() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e;
	}
	function ee() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e;
	}
	function A() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.value = e;
	}
	function te() {
		let e = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			let t = this.data.referenceType || "shortcut";
			e.type += "Reference", e.referenceType = t, delete e.url, delete e.title;
		} else delete e.identifier, delete e.label;
		this.data.referenceType = void 0;
	}
	function j() {
		let e = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			let t = this.data.referenceType || "shortcut";
			e.type += "Reference", e.referenceType = t, delete e.url, delete e.title;
		} else delete e.identifier, delete e.label;
		this.data.referenceType = void 0;
	}
	function M(e) {
		let t = this.sliceSerialize(e), n = this.stack[this.stack.length - 2];
		n.label = ii(t), n.identifier = Mt(t).toLowerCase();
	}
	function ne() {
		let e = this.stack[this.stack.length - 1], t = this.resume(), n = this.stack[this.stack.length - 1];
		this.data.inReference = !0, n.type === "link" ? n.children = e.children : n.alt = t;
	}
	function re() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.url = e;
	}
	function N() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.title = e;
	}
	function P() {
		this.data.inReference = void 0;
	}
	function ie() {
		this.data.referenceType = "collapsed";
	}
	function F(e) {
		let t = this.resume(), n = this.stack[this.stack.length - 1];
		n.label = t, n.identifier = Mt(this.sliceSerialize(e)).toLowerCase(), this.data.referenceType = "full";
	}
	function I(e) {
		this.data.characterReferenceType = e.type;
	}
	function ae(e) {
		let t = this.sliceSerialize(e), n = this.data.characterReferenceType, r;
		n ? (r = jt(t, n === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : r = wt(t);
		let i = this.stack[this.stack.length - 1];
		i.value += r;
	}
	function L(e) {
		let t = this.stack.pop();
		t.position.end = li(e.end);
	}
	function oe(e) {
		E.call(this, e);
		let t = this.stack[this.stack.length - 1];
		t.url = this.sliceSerialize(e);
	}
	function se(e) {
		E.call(this, e);
		let t = this.stack[this.stack.length - 1];
		t.url = "mailto:" + this.sliceSerialize(e);
	}
	function ce() {
		return {
			type: "blockquote",
			children: []
		};
	}
	function le() {
		return {
			type: "code",
			lang: null,
			meta: null,
			value: ""
		};
	}
	function ue() {
		return {
			type: "inlineCode",
			value: ""
		};
	}
	function de() {
		return {
			type: "definition",
			identifier: "",
			label: null,
			title: null,
			url: ""
		};
	}
	function fe() {
		return {
			type: "emphasis",
			children: []
		};
	}
	function pe() {
		return {
			type: "heading",
			depth: 0,
			children: []
		};
	}
	function me() {
		return { type: "break" };
	}
	function he() {
		return {
			type: "html",
			value: ""
		};
	}
	function ge() {
		return {
			type: "image",
			title: null,
			url: "",
			alt: null
		};
	}
	function _e() {
		return {
			type: "link",
			title: null,
			url: "",
			children: []
		};
	}
	function ve(e) {
		return {
			type: "list",
			ordered: e.type === "listOrdered",
			start: null,
			spread: e._spread,
			children: []
		};
	}
	function ye(e) {
		return {
			type: "listItem",
			spread: e._spread,
			checked: null,
			children: []
		};
	}
	function be() {
		return {
			type: "paragraph",
			children: []
		};
	}
	function xe() {
		return {
			type: "strong",
			children: []
		};
	}
	function Se() {
		return {
			type: "text",
			value: ""
		};
	}
	function Ce() {
		return { type: "thematicBreak" };
	}
}
function li(e) {
	return {
		line: e.line,
		column: e.column,
		offset: e.offset
	};
}
function ui(e, t) {
	let n = -1;
	for (; ++n < t.length;) {
		let r = t[n];
		Array.isArray(r) ? ui(e, r) : di(e, r);
	}
}
function di(e, t) {
	let n;
	for (n in t) if (oi.call(t, n)) switch (n) {
		case "canContainEols": {
			let r = t[n];
			r && e[n].push(...r);
			break;
		}
		case "transforms": {
			let r = t[n];
			r && e[n].push(...r);
			break;
		}
		case "enter":
		case "exit": {
			let r = t[n];
			r && Object.assign(e[n], r);
			break;
		}
	}
}
function fi(e, t) {
	throw Error(e ? "Cannot close `" + e.type + "` (" + Le({
		start: e.start,
		end: e.end
	}) + "): a different token (`" + t.type + "`, " + Le({
		start: t.start,
		end: t.end
	}) + ") is open" : "Cannot close document, a token (`" + t.type + "`, " + Le({
		start: t.start,
		end: t.end
	}) + ") is still open");
}
//#endregion
//#region node_modules/remark-parse/lib/index.js
function pi(e) {
	let t = this;
	t.parser = n;
	function n(n) {
		return si(n, {
			...t.data("settings"),
			...e,
			extensions: t.data("micromarkExtensions") || [],
			mdastExtensions: t.data("fromMarkdownExtensions") || []
		});
	}
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
function mi(e, t) {
	let n = {
		type: "element",
		tagName: "blockquote",
		properties: {},
		children: e.wrap(e.all(t), !0)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/break.js
function hi(e, t) {
	let n = {
		type: "element",
		tagName: "br",
		properties: {},
		children: []
	};
	return e.patch(t, n), [e.applyData(t, n), {
		type: "text",
		value: "\n"
	}];
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/code.js
function gi(e, t) {
	let n = t.value ? t.value + "\n" : "", r = {}, i = t.lang ? t.lang.split(/\s+/) : [];
	i.length > 0 && (r.className = ["language-" + i[0]]);
	let a = {
		type: "element",
		tagName: "code",
		properties: r,
		children: [{
			type: "text",
			value: n
		}]
	};
	return t.meta && (a.data = { meta: t.meta }), e.patch(t, a), a = e.applyData(t, a), a = {
		type: "element",
		tagName: "pre",
		properties: {},
		children: [a]
	}, e.patch(t, a), a;
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/delete.js
function _i(e, t) {
	let n = {
		type: "element",
		tagName: "del",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
function vi(e, t) {
	let n = {
		type: "element",
		tagName: "em",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
function yi(e, t) {
	let n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = Vt(r.toLowerCase()), a = e.footnoteOrder.indexOf(r), o, s = e.footnoteCounts.get(r);
	s === void 0 ? (s = 0, e.footnoteOrder.push(r), o = e.footnoteOrder.length) : o = a + 1, s += 1, e.footnoteCounts.set(r, s);
	let c = {
		type: "element",
		tagName: "a",
		properties: {
			href: "#" + n + "fn-" + i,
			id: n + "fnref-" + i + (s > 1 ? "-" + s : ""),
			dataFootnoteRef: !0,
			ariaDescribedBy: ["footnote-label"]
		},
		children: [{
			type: "text",
			value: String(o)
		}]
	};
	e.patch(t, c);
	let l = {
		type: "element",
		tagName: "sup",
		properties: {},
		children: [c]
	};
	return e.patch(t, l), e.applyData(t, l);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/heading.js
function bi(e, t) {
	let n = {
		type: "element",
		tagName: "h" + t.depth,
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/html.js
function xi(e, t) {
	if (e.options.allowDangerousHtml) {
		let n = {
			type: "raw",
			value: t.value
		};
		return e.patch(t, n), e.applyData(t, n);
	}
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/revert.js
function Si(e, t) {
	let n = t.referenceType, r = "]";
	if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference") return [{
		type: "text",
		value: "![" + t.alt + r
	}];
	let i = e.all(t), a = i[0];
	a && a.type === "text" ? a.value = "[" + a.value : i.unshift({
		type: "text",
		value: "["
	});
	let o = i[i.length - 1];
	return o && o.type === "text" ? o.value += r : i.push({
		type: "text",
		value: r
	}), i;
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
function Ci(e, t) {
	let n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
	if (!r) return Si(e, t);
	let i = {
		src: Vt(r.url || ""),
		alt: t.alt
	};
	r.title !== null && r.title !== void 0 && (i.title = r.title);
	let a = {
		type: "element",
		tagName: "img",
		properties: i,
		children: []
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/image.js
function wi(e, t) {
	let n = { src: Vt(t.url) };
	t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
	let r = {
		type: "element",
		tagName: "img",
		properties: n,
		children: []
	};
	return e.patch(t, r), e.applyData(t, r);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
function Ti(e, t) {
	let n = {
		type: "text",
		value: t.value.replace(/\r?\n|\r/g, " ")
	};
	e.patch(t, n);
	let r = {
		type: "element",
		tagName: "code",
		properties: {},
		children: [n]
	};
	return e.patch(t, r), e.applyData(t, r);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
function Ei(e, t) {
	let n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
	if (!r) return Si(e, t);
	let i = { href: Vt(r.url || "") };
	r.title !== null && r.title !== void 0 && (i.title = r.title);
	let a = {
		type: "element",
		tagName: "a",
		properties: i,
		children: e.all(t)
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/link.js
function Di(e, t) {
	let n = { href: Vt(t.url) };
	t.title !== null && t.title !== void 0 && (n.title = t.title);
	let r = {
		type: "element",
		tagName: "a",
		properties: n,
		children: e.all(t)
	};
	return e.patch(t, r), e.applyData(t, r);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/list-item.js
function Oi(e, t, n) {
	let r = e.all(t), i = n ? ki(n) : Ai(t), a = {}, o = [];
	if (typeof t.checked == "boolean") {
		let e = r[0], n;
		e && e.type === "element" && e.tagName === "p" ? n = e : (n = {
			type: "element",
			tagName: "p",
			properties: {},
			children: []
		}, r.unshift(n)), n.children.length > 0 && n.children.unshift({
			type: "text",
			value: " "
		}), n.children.unshift({
			type: "element",
			tagName: "input",
			properties: {
				type: "checkbox",
				checked: t.checked,
				disabled: !0
			},
			children: []
		}), a.className = ["task-list-item"];
	}
	let s = -1;
	for (; ++s < r.length;) {
		let e = r[s];
		(i || s !== 0 || e.type !== "element" || e.tagName !== "p") && o.push({
			type: "text",
			value: "\n"
		}), e.type === "element" && e.tagName === "p" && !i ? o.push(...e.children) : o.push(e);
	}
	let c = r[r.length - 1];
	c && (i || c.type !== "element" || c.tagName !== "p") && o.push({
		type: "text",
		value: "\n"
	});
	let l = {
		type: "element",
		tagName: "li",
		properties: a,
		children: o
	};
	return e.patch(t, l), e.applyData(t, l);
}
function ki(e) {
	let t = !1;
	if (e.type === "list") {
		t = e.spread || !1;
		let n = e.children, r = -1;
		for (; !t && ++r < n.length;) t = Ai(n[r]);
	}
	return t;
}
function Ai(e) {
	return e.spread ?? e.children.length > 1;
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/list.js
function ji(e, t) {
	let n = {}, r = e.all(t), i = -1;
	for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length;) {
		let e = r[i];
		if (e.type === "element" && e.tagName === "li" && e.properties && Array.isArray(e.properties.className) && e.properties.className.includes("task-list-item")) {
			n.className = ["contains-task-list"];
			break;
		}
	}
	let a = {
		type: "element",
		tagName: t.ordered ? "ol" : "ul",
		properties: n,
		children: e.wrap(r, !0)
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
function Mi(e, t) {
	let n = {
		type: "element",
		tagName: "p",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/root.js
function Ni(e, t) {
	let n = {
		type: "root",
		children: e.wrap(e.all(t))
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/strong.js
function Pi(e, t) {
	let n = {
		type: "element",
		tagName: "strong",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/table.js
function Fi(e, t) {
	let n = e.all(t), r = n.shift(), i = [];
	if (r) {
		let n = {
			type: "element",
			tagName: "thead",
			properties: {},
			children: e.wrap([r], !0)
		};
		e.patch(t.children[0], n), i.push(n);
	}
	if (n.length > 0) {
		let r = {
			type: "element",
			tagName: "tbody",
			properties: {},
			children: e.wrap(n, !0)
		}, a = Pe(t.children[1]), o = Ne(t.children[t.children.length - 1]);
		a && o && (r.position = {
			start: a,
			end: o
		}), i.push(r);
	}
	let a = {
		type: "element",
		tagName: "table",
		properties: {},
		children: e.wrap(i, !0)
	};
	return e.patch(t, a), e.applyData(t, a);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/table-row.js
function Ii(e, t, n) {
	let r = n ? n.children : void 0, i = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", a = n && n.type === "table" ? n.align : void 0, o = a ? a.length : t.children.length, s = -1, c = [];
	for (; ++s < o;) {
		let n = t.children[s], r = {}, o = a ? a[s] : void 0;
		o && (r.align = o);
		let l = {
			type: "element",
			tagName: i,
			properties: r,
			children: []
		};
		n && (l.children = e.all(n), e.patch(n, l), l = e.applyData(n, l)), c.push(l);
	}
	let l = {
		type: "element",
		tagName: "tr",
		properties: {},
		children: e.wrap(c, !0)
	};
	return e.patch(t, l), e.applyData(t, l);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
function Li(e, t) {
	let n = {
		type: "element",
		tagName: "td",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/trim-lines/index.js
var Ri = 9, zi = 32;
function Bi(e) {
	let t = String(e), n = /\r?\n|\r/g, r = n.exec(t), i = 0, a = [];
	for (; r;) a.push(Vi(t.slice(i, r.index), i > 0, !0), r[0]), i = r.index + r[0].length, r = n.exec(t);
	return a.push(Vi(t.slice(i), i > 0, !1)), a.join("");
}
function Vi(e, t, n) {
	let r = 0, i = e.length;
	if (t) {
		let t = e.codePointAt(r);
		for (; t === Ri || t === zi;) r++, t = e.codePointAt(r);
	}
	if (n) {
		let t = e.codePointAt(i - 1);
		for (; t === Ri || t === zi;) i--, t = e.codePointAt(i - 1);
	}
	return i > r ? e.slice(r, i) : "";
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/text.js
function Hi(e, t) {
	let n = {
		type: "text",
		value: Bi(String(t.value))
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
function Ui(e, t) {
	let n = {
		type: "element",
		tagName: "hr",
		properties: {},
		children: []
	};
	return e.patch(t, n), e.applyData(t, n);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/index.js
var Wi = {
	blockquote: mi,
	break: hi,
	code: gi,
	delete: _i,
	emphasis: vi,
	footnoteReference: yi,
	heading: bi,
	html: xi,
	imageReference: Ci,
	image: wi,
	inlineCode: Ti,
	linkReference: Ei,
	link: Di,
	listItem: Oi,
	list: ji,
	paragraph: Mi,
	root: Ni,
	strong: Pi,
	table: Fi,
	tableCell: Li,
	tableRow: Ii,
	text: Hi,
	thematicBreak: Ui,
	toml: Gi,
	yaml: Gi,
	definition: Gi,
	footnoteDefinition: Gi
};
function Gi() {}
//#endregion
//#region node_modules/@ungap/structured-clone/esm/deserialize.js
var Ki = typeof self == "object" ? self : globalThis, qi = (e, t) => {
	switch (e) {
		case "Function":
		case "SharedWorker":
		case "Worker":
		case "eval":
		case "setInterval":
		case "setTimeout": throw TypeError("unable to deserialize " + e);
	}
	return new Ki[e](t);
}, Ji = (e, t) => {
	let n = (t, n) => (e.set(n, t), t), r = (i) => {
		if (e.has(i)) return e.get(i);
		let [a, o] = t[i];
		switch (a) {
			case 0:
			case -1: return n(o, i);
			case 1: {
				let e = n([], i);
				for (let t of o) e.push(r(t));
				return e;
			}
			case 2: {
				let e = n({}, i);
				for (let [t, n] of o) e[r(t)] = r(n);
				return e;
			}
			case 3: return n(new Date(o), i);
			case 4: {
				let { source: e, flags: t } = o;
				return n(new RegExp(e, t), i);
			}
			case 5: {
				let e = n(/* @__PURE__ */ new Map(), i);
				for (let [t, n] of o) e.set(r(t), r(n));
				return e;
			}
			case 6: {
				let e = n(/* @__PURE__ */ new Set(), i);
				for (let t of o) e.add(r(t));
				return e;
			}
			case 7: {
				let { name: e, message: t } = o;
				return n(qi(e, t), i);
			}
			case 8: return n(BigInt(o), i);
			case "BigInt": return n(Object(BigInt(o)), i);
			case "ArrayBuffer": return n(new Uint8Array(o).buffer, o);
			case "DataView": {
				let { buffer: e } = new Uint8Array(o);
				return n(new DataView(e), o);
			}
		}
		return n(qi(a, o), i);
	};
	return r;
}, Yi = (e) => Ji(/* @__PURE__ */ new Map(), e)(0), Xi = "", { toString: Zi } = {}, { keys: Qi } = Object, $i = (e) => {
	let t = typeof e;
	if (t !== "object" || !e) return [0, t];
	let n = Zi.call(e).slice(8, -1);
	switch (n) {
		case "Array": return [1, Xi];
		case "Object": return [2, Xi];
		case "Date": return [3, Xi];
		case "RegExp": return [4, Xi];
		case "Map": return [5, Xi];
		case "Set": return [6, Xi];
		case "DataView": return [1, n];
	}
	return n.includes("Array") ? [1, n] : n.includes("Error") ? [7, n] : [2, n];
}, ea = ([e, t]) => e === 0 && (t === "function" || t === "symbol"), ta = (e, t, n, r) => {
	let i = (e, t) => {
		let i = r.push(e) - 1;
		return n.set(t, i), i;
	}, a = (r) => {
		if (n.has(r)) return n.get(r);
		let [o, s] = $i(r);
		switch (o) {
			case 0: {
				let t = r;
				switch (s) {
					case "bigint":
						o = 8, t = r.toString();
						break;
					case "function":
					case "symbol":
						if (e) throw TypeError("unable to serialize " + s);
						t = null;
						break;
					case "undefined": return i([-1], r);
				}
				return i([o, t], r);
			}
			case 1: {
				if (s) {
					let e = r;
					return s === "DataView" ? e = new Uint8Array(r.buffer) : s === "ArrayBuffer" && (e = new Uint8Array(r)), i([s, [...e]], r);
				}
				let e = [], t = i([o, e], r);
				for (let t of r) e.push(a(t));
				return t;
			}
			case 2: {
				if (s) switch (s) {
					case "BigInt": return i([s, r.toString()], r);
					case "Boolean":
					case "Number":
					case "String": return i([s, r.valueOf()], r);
				}
				if (t && "toJSON" in r) return a(r.toJSON());
				let n = [], c = i([o, n], r);
				for (let t of Qi(r)) (e || !ea($i(r[t]))) && n.push([a(t), a(r[t])]);
				return c;
			}
			case 3: return i([o, r.toISOString()], r);
			case 4: {
				let { source: e, flags: t } = r;
				return i([o, {
					source: e,
					flags: t
				}], r);
			}
			case 5: {
				let t = [], n = i([o, t], r);
				for (let [n, i] of r) (e || !(ea($i(n)) || ea($i(i)))) && t.push([a(n), a(i)]);
				return n;
			}
			case 6: {
				let t = [], n = i([o, t], r);
				for (let n of r) (e || !ea($i(n))) && t.push(a(n));
				return n;
			}
		}
		let { message: c } = r;
		return i([o, {
			name: s,
			message: c
		}], r);
	};
	return a;
}, na = (e, { json: t, lossy: n } = {}) => {
	let r = [];
	return ta(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, ra = typeof structuredClone == "function" ? (e, t) => t && ("json" in t || "lossy" in t) ? Yi(na(e, t)) : structuredClone(e) : (e, t) => Yi(na(e, t));
//#endregion
//#region node_modules/mdast-util-to-hast/lib/footer.js
function ia(e, t) {
	let n = [{
		type: "text",
		value: "↩"
	}];
	return t > 1 && n.push({
		type: "element",
		tagName: "sup",
		properties: {},
		children: [{
			type: "text",
			value: String(t)
		}]
	}), n;
}
function aa(e, t) {
	return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function oa(e) {
	let t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || ia, r = e.options.footnoteBackLabel || aa, i = e.options.footnoteLabel || "Footnotes", a = e.options.footnoteLabelTagName || "h2", o = e.options.footnoteLabelProperties || { className: ["sr-only"] }, s = [], c = -1;
	for (; ++c < e.footnoteOrder.length;) {
		let i = e.footnoteById.get(e.footnoteOrder[c]);
		if (!i) continue;
		let a = e.all(i), o = String(i.identifier).toUpperCase(), l = Vt(o.toLowerCase()), u = 0, d = [], f = e.footnoteCounts.get(o);
		for (; f !== void 0 && ++u <= f;) {
			d.length > 0 && d.push({
				type: "text",
				value: " "
			});
			let e = typeof n == "string" ? n : n(c, u);
			typeof e == "string" && (e = {
				type: "text",
				value: e
			}), d.push({
				type: "element",
				tagName: "a",
				properties: {
					href: "#" + t + "fnref-" + l + (u > 1 ? "-" + u : ""),
					dataFootnoteBackref: "",
					ariaLabel: typeof r == "string" ? r : r(c, u),
					className: ["data-footnote-backref"]
				},
				children: Array.isArray(e) ? e : [e]
			});
		}
		let p = a[a.length - 1];
		if (p && p.type === "element" && p.tagName === "p") {
			let e = p.children[p.children.length - 1];
			e && e.type === "text" ? e.value += " " : p.children.push({
				type: "text",
				value: " "
			}), p.children.push(...d);
		} else a.push(...d);
		let m = {
			type: "element",
			tagName: "li",
			properties: { id: t + "fn-" + l },
			children: e.wrap(a, !0)
		};
		e.patch(i, m), s.push(m);
	}
	if (s.length !== 0) return {
		type: "element",
		tagName: "section",
		properties: {
			dataFootnotes: !0,
			className: ["footnotes"]
		},
		children: [
			{
				type: "element",
				tagName: a,
				properties: {
					...ra(o),
					id: "footnote-label"
				},
				children: [{
					type: "text",
					value: i
				}]
			},
			{
				type: "text",
				value: "\n"
			},
			{
				type: "element",
				tagName: "ol",
				properties: {},
				children: e.wrap(s, !0)
			},
			{
				type: "text",
				value: "\n"
			}
		]
	};
}
//#endregion
//#region node_modules/unist-util-is/lib/index.js
var sa = (function(e) {
	if (e == null) return fa;
	if (typeof e == "function") return da(e);
	if (typeof e == "object") return Array.isArray(e) ? ca(e) : la(e);
	if (typeof e == "string") return ua(e);
	throw Error("Expected function, string, or object as test");
});
function ca(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t[n] = sa(e[n]);
	return da(r);
	function r(...e) {
		let n = -1;
		for (; ++n < t.length;) if (t[n].apply(this, e)) return !0;
		return !1;
	}
}
function la(e) {
	let t = e;
	return da(n);
	function n(n) {
		let r = n, i;
		for (i in e) if (r[i] !== t[i]) return !1;
		return !0;
	}
}
function ua(e) {
	return da(t);
	function t(t) {
		return t && t.type === e;
	}
}
function da(e) {
	return t;
	function t(t, n, r) {
		return !!(pa(t) && e.call(this, t, typeof n == "number" ? n : void 0, r || void 0));
	}
}
function fa() {
	return !0;
}
function pa(e) {
	return typeof e == "object" && !!e && "type" in e;
}
//#endregion
//#region node_modules/unist-util-visit-parents/lib/color.js
function ma(e) {
	return e;
}
//#endregion
//#region node_modules/unist-util-visit-parents/lib/index.js
var ha = [];
function ga(e, t, n, r) {
	let i;
	typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
	let a = sa(i), o = r ? -1 : 1;
	s(e, void 0, [])();
	function s(e, i, c) {
		let l = e && typeof e == "object" ? e : {};
		if (typeof l.type == "string") {
			let t = typeof l.tagName == "string" ? l.tagName : typeof l.name == "string" ? l.name : void 0;
			Object.defineProperty(u, "name", { value: "node (" + ma(e.type + (t ? "<" + t + ">" : "")) + ")" });
		}
		return u;
		function u() {
			let l = ha, u, d, f;
			if ((!t || a(e, i, c[c.length - 1] || void 0)) && (l = _a(n(e, c)), l[0] === !1)) return l;
			if ("children" in e && e.children) {
				let t = e;
				if (t.children && l[0] !== "skip") for (d = (r ? t.children.length : -1) + o, f = c.concat(t); d > -1 && d < t.children.length;) {
					let e = t.children[d];
					if (u = s(e, d, f)(), u[0] === !1) return u;
					d = typeof u[1] == "number" ? u[1] : d + o;
				}
			}
			return l;
		}
	}
}
function _a(e) {
	return Array.isArray(e) ? e : typeof e == "number" ? [!0, e] : e == null ? ha : [e];
}
//#endregion
//#region node_modules/unist-util-visit/lib/index.js
function va(e, t, n, r) {
	let i, a, o;
	typeof t == "function" && typeof n != "function" ? (a = void 0, o = t, i = n) : (a = t, o = n, i = r), ga(e, a, s, i);
	function s(e, t) {
		let n = t[t.length - 1], r = n ? n.children.indexOf(e) : void 0;
		return o(e, r, n);
	}
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/state.js
var ya = {}.hasOwnProperty, ba = {};
function xa(e, t) {
	let n = t || ba, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = {
		all: s,
		applyData: Ca,
		definitionById: r,
		footnoteById: i,
		footnoteCounts: /* @__PURE__ */ new Map(),
		footnoteOrder: [],
		handlers: {
			...Wi,
			...n.handlers
		},
		one: o,
		options: n,
		patch: Sa,
		wrap: Ta
	};
	return va(e, function(e) {
		if (e.type === "definition" || e.type === "footnoteDefinition") {
			let t = e.type === "definition" ? r : i, n = String(e.identifier).toUpperCase();
			t.has(n) || t.set(n, e);
		}
	}), a;
	function o(e, t) {
		let n = e.type, r = a.handlers[n];
		if (ya.call(a.handlers, n) && r) return r(a, e, t);
		if (a.options.passThrough && a.options.passThrough.includes(n)) {
			if ("children" in e) {
				let { children: t, ...n } = e, r = ra(n);
				return r.children = a.all(e), r;
			}
			return ra(e);
		}
		return (a.options.unknownHandler || wa)(a, e, t);
	}
	function s(e) {
		let t = [];
		if ("children" in e) {
			let n = e.children, r = -1;
			for (; ++r < n.length;) {
				let i = a.one(n[r], e);
				if (i) {
					if (r && n[r - 1].type === "break" && (!Array.isArray(i) && i.type === "text" && (i.value = Ea(i.value)), !Array.isArray(i) && i.type === "element")) {
						let e = i.children[0];
						e && e.type === "text" && (e.value = Ea(e.value));
					}
					Array.isArray(i) ? t.push(...i) : t.push(i);
				}
			}
		}
		return t;
	}
}
function Sa(e, t) {
	e.position && (t.position = Ie(e));
}
function Ca(e, t) {
	let n = t;
	if (e && e.data) {
		let t = e.data.hName, r = e.data.hChildren, i = e.data.hProperties;
		typeof t == "string" && (n.type === "element" ? n.tagName = t : n = {
			type: "element",
			tagName: t,
			properties: {},
			children: "children" in n ? n.children : [n]
		}), n.type === "element" && i && Object.assign(n.properties, ra(i)), "children" in n && n.children && r != null && (n.children = r);
	}
	return n;
}
function wa(e, t) {
	let n = t.data || {}, r = "value" in t && !(ya.call(n, "hProperties") || ya.call(n, "hChildren")) ? {
		type: "text",
		value: t.value
	} : {
		type: "element",
		tagName: "div",
		properties: {},
		children: e.all(t)
	};
	return e.patch(t, r), e.applyData(t, r);
}
function Ta(e, t) {
	let n = [], r = -1;
	for (t && n.push({
		type: "text",
		value: "\n"
	}); ++r < e.length;) r && n.push({
		type: "text",
		value: "\n"
	}), n.push(e[r]);
	return t && e.length > 0 && n.push({
		type: "text",
		value: "\n"
	}), n;
}
function Ea(e) {
	let t = 0, n = e.charCodeAt(t);
	for (; n === 9 || n === 32;) t++, n = e.charCodeAt(t);
	return e.slice(t);
}
//#endregion
//#region node_modules/mdast-util-to-hast/lib/index.js
function Da(e, t) {
	let n = xa(e, t), r = n.one(e, void 0), i = oa(n), a = Array.isArray(r) ? {
		type: "root",
		children: r
	} : r || {
		type: "root",
		children: []
	};
	return i && ("children" in a, a.children.push({
		type: "text",
		value: "\n"
	}, i)), a;
}
//#endregion
//#region node_modules/remark-rehype/lib/index.js
function Oa(e, t) {
	return e && "run" in e ? async function(n, r) {
		let i = Da(n, {
			file: r,
			...t
		});
		await e.run(i, r);
	} : function(n, r) {
		return Da(n, {
			file: r,
			...e || t
		});
	};
}
//#endregion
//#region node_modules/bail/index.js
function ka(e) {
	if (e) throw e;
}
//#endregion
//#region node_modules/extend/index.js
var Aa = /* @__PURE__ */ o(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = Object.prototype.toString, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = function(e) {
		return typeof Array.isArray == "function" ? Array.isArray(e) : r.call(e) === "[object Array]";
	}, s = function(e) {
		if (!e || r.call(e) !== "[object Object]") return !1;
		var t = n.call(e, "constructor"), i = e.constructor && e.constructor.prototype && n.call(e.constructor.prototype, "isPrototypeOf");
		if (e.constructor && !t && !i) return !1;
		for (var a in e);
		return a === void 0 || n.call(e, a);
	}, c = function(e, t) {
		i && t.name === "__proto__" ? i(e, t.name, {
			enumerable: !0,
			configurable: !0,
			value: t.newValue,
			writable: !0
		}) : e[t.name] = t.newValue;
	}, l = function(e, t) {
		if (t === "__proto__") {
			if (!n.call(e, t)) return;
			if (a) return a(e, t).value;
		}
		return e[t];
	};
	t.exports = function e() {
		var t, n, r, i, a, u, d = arguments[0], f = 1, p = arguments.length, m = !1;
		for (typeof d == "boolean" && (m = d, d = arguments[1] || {}, f = 2), (d == null || typeof d != "object" && typeof d != "function") && (d = {}); f < p; ++f) if (t = arguments[f], t != null) for (n in t) r = l(d, n), i = l(t, n), d !== i && (m && i && (s(i) || (a = o(i))) ? (a ? (a = !1, u = r && o(r) ? r : []) : u = r && s(r) ? r : {}, c(d, {
			name: n,
			newValue: e(m, u, i)
		})) : i !== void 0 && c(d, {
			name: n,
			newValue: i
		}));
		return d;
	};
}));
//#endregion
//#region node_modules/is-plain-obj/index.js
function ja(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
//#endregion
//#region node_modules/trough/lib/index.js
function Ma() {
	let e = [], t = {
		run: n,
		use: r
	};
	return t;
	function n(...t) {
		let n = -1, r = t.pop();
		if (typeof r != "function") throw TypeError("Expected function as last argument, not " + r);
		i(null, ...t);
		function i(a, ...o) {
			let s = e[++n], c = -1;
			if (a) {
				r(a);
				return;
			}
			for (; ++c < t.length;) (o[c] === null || o[c] === void 0) && (o[c] = t[c]);
			t = o, s ? Na(s, i)(...o) : r(null, ...o);
		}
	}
	function r(n) {
		if (typeof n != "function") throw TypeError("Expected `middelware` to be a function, not " + n);
		return e.push(n), t;
	}
}
function Na(e, t) {
	let n;
	return r;
	function r(...t) {
		let r = e.length > t.length, o;
		r && t.push(i);
		try {
			o = e.apply(this, t);
		} catch (e) {
			let t = e;
			if (r && n) throw t;
			return i(t);
		}
		r || (o && o.then && typeof o.then == "function" ? o.then(a, i) : o instanceof Error ? i(o) : a(o));
	}
	function i(e, ...r) {
		n || (n = !0, t(e, ...r));
	}
	function a(e) {
		i(null, e);
	}
}
//#endregion
//#region node_modules/vfile/lib/minpath.browser.js
var Pa = {
	basename: Fa,
	dirname: Ia,
	extname: La,
	join: Ra,
	sep: "/"
};
function Fa(e, t) {
	if (t !== void 0 && typeof t != "string") throw TypeError("\"ext\" argument must be a string");
	Va(e);
	let n = 0, r = -1, i = e.length, a;
	if (t === void 0 || t.length === 0 || t.length > e.length) {
		for (; i--;) if (e.codePointAt(i) === 47) {
			if (a) {
				n = i + 1;
				break;
			}
		} else r < 0 && (a = !0, r = i + 1);
		return r < 0 ? "" : e.slice(n, r);
	}
	if (t === e) return "";
	let o = -1, s = t.length - 1;
	for (; i--;) if (e.codePointAt(i) === 47) {
		if (a) {
			n = i + 1;
			break;
		}
	} else o < 0 && (a = !0, o = i + 1), s > -1 && (e.codePointAt(i) === t.codePointAt(s--) ? s < 0 && (r = i) : (s = -1, r = o));
	return n === r ? r = o : r < 0 && (r = e.length), e.slice(n, r);
}
function Ia(e) {
	if (Va(e), e.length === 0) return ".";
	let t = -1, n = e.length, r;
	for (; --n;) if (e.codePointAt(n) === 47) {
		if (r) {
			t = n;
			break;
		}
	} else r ||= !0;
	return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function La(e) {
	Va(e);
	let t = e.length, n = -1, r = 0, i = -1, a = 0, o;
	for (; t--;) {
		let s = e.codePointAt(t);
		if (s === 47) {
			if (o) {
				r = t + 1;
				break;
			}
			continue;
		}
		n < 0 && (o = !0, n = t + 1), s === 46 ? i < 0 ? i = t : a !== 1 && (a = 1) : i > -1 && (a = -1);
	}
	return i < 0 || n < 0 || a === 0 || a === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function Ra(...e) {
	let t = -1, n;
	for (; ++t < e.length;) Va(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
	return n === void 0 ? "." : za(n);
}
function za(e) {
	Va(e);
	let t = e.codePointAt(0) === 47, n = Ba(e, !t);
	return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function Ba(e, t) {
	let n = "", r = 0, i = -1, a = 0, o = -1, s, c;
	for (; ++o <= e.length;) {
		if (o < e.length) s = e.codePointAt(o);
		else if (s === 47) break;
		else s = 47;
		if (s === 47) {
			if (!(i === o - 1 || a === 1)) if (i !== o - 1 && a === 2) {
				if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
					if (n.length > 2) {
						if (c = n.lastIndexOf("/"), c !== n.length - 1) {
							c < 0 ? (n = "", r = 0) : (n = n.slice(0, c), r = n.length - 1 - n.lastIndexOf("/")), i = o, a = 0;
							continue;
						}
					} else if (n.length > 0) {
						n = "", r = 0, i = o, a = 0;
						continue;
					}
				}
				t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
			} else n.length > 0 ? n += "/" + e.slice(i + 1, o) : n = e.slice(i + 1, o), r = o - i - 1;
			i = o, a = 0;
		} else s === 46 && a > -1 ? a++ : a = -1;
	}
	return n;
}
function Va(e) {
	if (typeof e != "string") throw TypeError("Path must be a string. Received " + JSON.stringify(e));
}
//#endregion
//#region node_modules/vfile/lib/minproc.browser.js
var Ha = { cwd: Ua };
function Ua() {
	return "/";
}
//#endregion
//#region node_modules/vfile/lib/minurl.shared.js
function Wa(e) {
	return !!(typeof e == "object" && e && "href" in e && e.href && "protocol" in e && e.protocol && e.auth === void 0);
}
//#endregion
//#region node_modules/vfile/lib/minurl.browser.js
function Ga(e) {
	if (typeof e == "string") e = new URL(e);
	else if (!Wa(e)) {
		let t = /* @__PURE__ */ TypeError("The \"path\" argument must be of type string or an instance of URL. Received `" + e + "`");
		throw t.code = "ERR_INVALID_ARG_TYPE", t;
	}
	if (e.protocol !== "file:") {
		let e = /* @__PURE__ */ TypeError("The URL must be of scheme file");
		throw e.code = "ERR_INVALID_URL_SCHEME", e;
	}
	return Ka(e);
}
function Ka(e) {
	if (e.hostname !== "") {
		let e = /* @__PURE__ */ TypeError("File URL host must be \"localhost\" or empty on darwin");
		throw e.code = "ERR_INVALID_FILE_URL_HOST", e;
	}
	let t = e.pathname, n = -1;
	for (; ++n < t.length;) if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
		let e = t.codePointAt(n + 2);
		if (e === 70 || e === 102) {
			let e = /* @__PURE__ */ TypeError("File URL path must not include encoded / characters");
			throw e.code = "ERR_INVALID_FILE_URL_PATH", e;
		}
	}
	return decodeURIComponent(t);
}
//#endregion
//#region node_modules/vfile/lib/index.js
var qa = [
	"history",
	"path",
	"basename",
	"stem",
	"extname",
	"dirname"
], Ja = class {
	constructor(e) {
		let t;
		t = e ? Wa(e) ? { path: e } : typeof e == "string" || Qa(e) ? { value: e } : e : {}, this.cwd = "cwd" in t ? "" : Ha.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
		let n = -1;
		for (; ++n < qa.length;) {
			let e = qa[n];
			e in t && t[e] !== void 0 && t[e] !== null && (this[e] = e === "history" ? [...t[e]] : t[e]);
		}
		let r;
		for (r in t) qa.includes(r) || (this[r] = t[r]);
	}
	get basename() {
		return typeof this.path == "string" ? Pa.basename(this.path) : void 0;
	}
	set basename(e) {
		Xa(e, "basename"), Ya(e, "basename"), this.path = Pa.join(this.dirname || "", e);
	}
	get dirname() {
		return typeof this.path == "string" ? Pa.dirname(this.path) : void 0;
	}
	set dirname(e) {
		Za(this.basename, "dirname"), this.path = Pa.join(e || "", this.basename);
	}
	get extname() {
		return typeof this.path == "string" ? Pa.extname(this.path) : void 0;
	}
	set extname(e) {
		if (Ya(e, "extname"), Za(this.dirname, "extname"), e) {
			if (e.codePointAt(0) !== 46) throw Error("`extname` must start with `.`");
			if (e.includes(".", 1)) throw Error("`extname` cannot contain multiple dots");
		}
		this.path = Pa.join(this.dirname, this.stem + (e || ""));
	}
	get path() {
		return this.history[this.history.length - 1];
	}
	set path(e) {
		Wa(e) && (e = Ga(e)), Xa(e, "path"), this.path !== e && this.history.push(e);
	}
	get stem() {
		return typeof this.path == "string" ? Pa.basename(this.path, this.extname) : void 0;
	}
	set stem(e) {
		Xa(e, "stem"), Ya(e, "stem"), this.path = Pa.join(this.dirname || "", e + (this.extname || ""));
	}
	fail(e, t, n) {
		let r = this.message(e, t, n);
		throw r.fatal = !0, r;
	}
	info(e, t, n) {
		let r = this.message(e, t, n);
		return r.fatal = void 0, r;
	}
	message(e, t, n) {
		let r = new R(e, t, n);
		return this.path && (r.name = this.path + ":" + r.name, r.file = this.path), r.fatal = !1, this.messages.push(r), r;
	}
	toString(e) {
		return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(e || void 0).decode(this.value);
	}
};
function Ya(e, t) {
	if (e && e.includes(Pa.sep)) throw Error("`" + t + "` cannot be a path: did not expect `" + Pa.sep + "`");
}
function Xa(e, t) {
	if (!e) throw Error("`" + t + "` cannot be empty");
}
function Za(e, t) {
	if (!e) throw Error("Setting `" + t + "` requires `path` to be set too");
}
function Qa(e) {
	return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
//#endregion
//#region node_modules/unified/lib/callable-instance.js
var $a = (function(e) {
	let t = this.constructor.prototype, n = t[e], r = function() {
		return n.apply(r, arguments);
	};
	return Object.setPrototypeOf(r, t), r;
}), eo = /* @__PURE__ */ l(Aa(), 1), to = {}.hasOwnProperty, no = new class e extends $a {
	constructor() {
		super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = Ma();
	}
	copy() {
		let t = new e(), n = -1;
		for (; ++n < this.attachers.length;) {
			let e = this.attachers[n];
			t.use(...e);
		}
		return t.data((0, eo.default)(!0, {}, this.namespace)), t;
	}
	data(e, t) {
		return typeof e == "string" ? arguments.length === 2 ? (ao("data", this.frozen), this.namespace[e] = t, this) : to.call(this.namespace, e) && this.namespace[e] || void 0 : e ? (ao("data", this.frozen), this.namespace = e, this) : this.namespace;
	}
	freeze() {
		if (this.frozen) return this;
		let e = this;
		for (; ++this.freezeIndex < this.attachers.length;) {
			let [t, ...n] = this.attachers[this.freezeIndex];
			if (n[0] === !1) continue;
			n[0] === !0 && (n[0] = void 0);
			let r = t.call(e, ...n);
			typeof r == "function" && this.transformers.use(r);
		}
		return this.frozen = !0, this.freezeIndex = Infinity, this;
	}
	parse(e) {
		this.freeze();
		let t = co(e), n = this.parser || this.Parser;
		return ro("parse", n), n(String(t), t);
	}
	process(e, t) {
		let n = this;
		return this.freeze(), ro("process", this.parser || this.Parser), io("process", this.compiler || this.Compiler), t ? r(void 0, t) : new Promise(r);
		function r(r, i) {
			let a = co(e), o = n.parse(a);
			n.run(o, a, function(e, t, r) {
				if (e || !t || !r) return s(e);
				let i = t, a = n.stringify(i, r);
				uo(a) ? r.value = a : r.result = a, s(e, r);
			});
			function s(e, n) {
				e || !n ? i(e) : r ? r(n) : t(void 0, n);
			}
		}
	}
	processSync(e) {
		let t = !1, n;
		return this.freeze(), ro("processSync", this.parser || this.Parser), io("processSync", this.compiler || this.Compiler), this.process(e, r), so("processSync", "process", t), n;
		function r(e, r) {
			t = !0, ka(e), n = r;
		}
	}
	run(e, t, n) {
		oo(e), this.freeze();
		let r = this.transformers;
		return !n && typeof t == "function" && (n = t, t = void 0), n ? i(void 0, n) : new Promise(i);
		function i(i, a) {
			let o = co(t);
			r.run(e, o, s);
			function s(t, r, o) {
				let s = r || e;
				t ? a(t) : i ? i(s) : n(void 0, s, o);
			}
		}
	}
	runSync(e, t) {
		let n = !1, r;
		return this.run(e, t, i), so("runSync", "run", n), r;
		function i(e, t) {
			ka(e), r = t, n = !0;
		}
	}
	stringify(e, t) {
		this.freeze();
		let n = co(t), r = this.compiler || this.Compiler;
		return io("stringify", r), oo(e), r(e, n);
	}
	use(e, ...t) {
		let n = this.attachers, r = this.namespace;
		if (ao("use", this.frozen), e != null) if (typeof e == "function") s(e, t);
		else if (typeof e == "object") Array.isArray(e) ? o(e) : a(e);
		else throw TypeError("Expected usable value, not `" + e + "`");
		return this;
		function i(e) {
			if (typeof e == "function") s(e, []);
			else if (typeof e == "object") if (Array.isArray(e)) {
				let [t, ...n] = e;
				s(t, n);
			} else a(e);
			else throw TypeError("Expected usable value, not `" + e + "`");
		}
		function a(e) {
			if (!("plugins" in e) && !("settings" in e)) throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
			o(e.plugins), e.settings && (r.settings = (0, eo.default)(!0, r.settings, e.settings));
		}
		function o(e) {
			let t = -1;
			if (e != null) if (Array.isArray(e)) for (; ++t < e.length;) {
				let n = e[t];
				i(n);
			}
			else throw TypeError("Expected a list of plugins, not `" + e + "`");
		}
		function s(e, t) {
			let r = -1, i = -1;
			for (; ++r < n.length;) if (n[r][0] === e) {
				i = r;
				break;
			}
			if (i === -1) n.push([e, ...t]);
			else if (t.length > 0) {
				let [r, ...a] = t, o = n[i][1];
				ja(o) && ja(r) && (r = (0, eo.default)(!0, o, r)), n[i] = [
					e,
					r,
					...a
				];
			}
		}
	}
}().freeze();
function ro(e, t) {
	if (typeof t != "function") throw TypeError("Cannot `" + e + "` without `parser`");
}
function io(e, t) {
	if (typeof t != "function") throw TypeError("Cannot `" + e + "` without `compiler`");
}
function ao(e, t) {
	if (t) throw Error("Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
function oo(e) {
	if (!ja(e) || typeof e.type != "string") throw TypeError("Expected node, got `" + e + "`");
}
function so(e, t, n) {
	if (!n) throw Error("`" + e + "` finished async. Use `" + t + "` instead");
}
function co(e) {
	return lo(e) ? e : new Ja(e);
}
function lo(e) {
	return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function uo(e) {
	return typeof e == "string" || fo(e);
}
function fo(e) {
	return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
//#endregion
//#region node_modules/react-markdown/lib/index.js
var po = [], mo = { allowDangerousHtml: !0 }, ho = /^(https?|ircs?|mailto|xmpp)$/i, go = [
	{
		from: "astPlugins",
		id: "remove-buggy-html-in-markdown-parser"
	},
	{
		from: "allowDangerousHtml",
		id: "remove-buggy-html-in-markdown-parser"
	},
	{
		from: "allowNode",
		id: "replace-allownode-allowedtypes-and-disallowedtypes",
		to: "allowElement"
	},
	{
		from: "allowedTypes",
		id: "replace-allownode-allowedtypes-and-disallowedtypes",
		to: "allowedElements"
	},
	{
		from: "className",
		id: "remove-classname"
	},
	{
		from: "disallowedTypes",
		id: "replace-allownode-allowedtypes-and-disallowedtypes",
		to: "disallowedElements"
	},
	{
		from: "escapeHtml",
		id: "remove-buggy-html-in-markdown-parser"
	},
	{
		from: "includeElementIndex",
		id: "#remove-includeelementindex"
	},
	{
		from: "includeNodeIndex",
		id: "change-includenodeindex-to-includeelementindex"
	},
	{
		from: "linkTarget",
		id: "remove-linktarget"
	},
	{
		from: "plugins",
		id: "change-plugins-to-remarkplugins",
		to: "remarkPlugins"
	},
	{
		from: "rawSourcePos",
		id: "#remove-rawsourcepos"
	},
	{
		from: "renderers",
		id: "change-renderers-to-components",
		to: "components"
	},
	{
		from: "source",
		id: "change-source-to-children",
		to: "children"
	},
	{
		from: "sourcePos",
		id: "#remove-sourcepos"
	},
	{
		from: "transformImageUri",
		id: "#add-urltransform",
		to: "urlTransform"
	},
	{
		from: "transformLinkUri",
		id: "#add-urltransform",
		to: "urlTransform"
	}
];
function _o(e) {
	let t = vo(e), n = yo(e);
	return bo(t.runSync(t.parse(n), n), e);
}
function vo(e) {
	let t = e.rehypePlugins || po, n = e.remarkPlugins || po, r = e.remarkRehypeOptions ? {
		...e.remarkRehypeOptions,
		...mo
	} : mo;
	return no().use(pi).use(n).use(Oa, r).use(t);
}
function yo(e) {
	let t = e.children || "", n = new Ja();
	return typeof t == "string" ? n.value = t : "" + t, n;
}
function bo(e, t) {
	let n = t.allowedElements, r = t.allowElement, i = t.components, a = t.disallowedElements, o = t.skipHtml, s = t.unwrapDisallowed, c = t.urlTransform || xo;
	for (let e of go) Object.hasOwn(t, e.from) && "" + e.from + (e.to ? "use `" + e.to + "` instead" : "remove it") + e.id;
	return va(e, l), qe(e, {
		Fragment: _t,
		components: i,
		ignoreInvalidStyle: !0,
		jsx: z,
		jsxs: B,
		passKeys: !0,
		passNode: !0
	});
	function l(e, t, i) {
		if (e.type === "raw" && i && typeof t == "number") return o ? i.children.splice(t, 1) : i.children[t] = {
			type: "text",
			value: e.value
		}, t;
		if (e.type === "element") {
			let t;
			for (t in ht) if (Object.hasOwn(ht, t) && Object.hasOwn(e.properties, t)) {
				let n = e.properties[t], r = ht[t];
				(r === null || r.includes(e.tagName)) && (e.properties[t] = c(String(n || ""), t, e));
			}
		}
		if (e.type === "element") {
			let o = n ? !n.includes(e.tagName) : a ? a.includes(e.tagName) : !1;
			if (!o && r && typeof t == "number" && (o = !r(e, t, i)), o && i && typeof t == "number") return s && e.children ? i.children.splice(t, 1, ...e.children) : i.children.splice(t, 1), t;
		}
	}
}
function xo(e) {
	let t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
	return t === -1 || i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || ho.test(e.slice(0, t)) ? e : "";
}
//#endregion
//#region node_modules/ccount/index.js
function So(e, t) {
	let n = String(e);
	if (typeof t != "string") throw TypeError("Expected character");
	let r = 0, i = n.indexOf(t);
	for (; i !== -1;) r++, i = n.indexOf(t, i + t.length);
	return r;
}
//#endregion
//#region node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp/index.js
function Co(e) {
	if (typeof e != "string") throw TypeError("Expected a string");
	return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
//#endregion
//#region node_modules/mdast-util-find-and-replace/lib/index.js
function wo(e, t, n) {
	let r = sa((n || {}).ignore || []), i = To(t), a = -1;
	for (; ++a < i.length;) ga(e, "text", o);
	function o(e, t) {
		let n = -1, i;
		for (; ++n < t.length;) {
			let e = t[n], a = i ? i.children : void 0;
			if (r(e, a ? a.indexOf(e) : void 0, i)) return;
			i = e;
		}
		if (i) return s(e, t);
	}
	function s(e, t) {
		let n = t[t.length - 1], r = i[a][0], o = i[a][1], s = 0, c = n.children.indexOf(e), l = !1, u = [];
		r.lastIndex = 0;
		let d = r.exec(e.value);
		for (; d;) {
			let n = d.index, i = {
				index: d.index,
				input: d.input,
				stack: [...t, e]
			}, a = o(...d, i);
			if (typeof a == "string" && (a = a.length > 0 ? {
				type: "text",
				value: a
			} : void 0), a === !1 ? r.lastIndex = n + 1 : (s !== n && u.push({
				type: "text",
				value: e.value.slice(s, n)
			}), Array.isArray(a) ? u.push(...a) : a && u.push(a), s = n + d[0].length, l = !0), !r.global) break;
			d = r.exec(e.value);
		}
		return l ? (s < e.value.length && u.push({
			type: "text",
			value: e.value.slice(s)
		}), n.children.splice(c, 1, ...u)) : u = [e], c + u.length;
	}
}
function To(e) {
	let t = [];
	if (!Array.isArray(e)) throw TypeError("Expected find and replace tuple or list of tuples");
	let n = !e[0] || Array.isArray(e[0]) ? e : [e], r = -1;
	for (; ++r < n.length;) {
		let e = n[r];
		t.push([Eo(e[0]), Do(e[1])]);
	}
	return t;
}
function Eo(e) {
	return typeof e == "string" ? new RegExp(Co(e), "g") : e;
}
function Do(e) {
	return typeof e == "function" ? e : function() {
		return e;
	};
}
//#endregion
//#region node_modules/mdast-util-gfm-autolink-literal/lib/index.js
var Oo = "phrasing", ko = [
	"autolink",
	"link",
	"image",
	"label"
];
function Ao() {
	return {
		transforms: [Ro],
		enter: {
			literalAutolink: Mo,
			literalAutolinkEmail: No,
			literalAutolinkHttp: No,
			literalAutolinkWww: No
		},
		exit: {
			literalAutolink: Lo,
			literalAutolinkEmail: Io,
			literalAutolinkHttp: Po,
			literalAutolinkWww: Fo
		}
	};
}
function jo() {
	return { unsafe: [
		{
			character: "@",
			before: "[+\\-.\\w]",
			after: "[\\-.\\w]",
			inConstruct: Oo,
			notInConstruct: ko
		},
		{
			character: ".",
			before: "[Ww]",
			after: "[\\-.\\w]",
			inConstruct: Oo,
			notInConstruct: ko
		},
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct: Oo,
			notInConstruct: ko
		}
	] };
}
function Mo(e) {
	this.enter({
		type: "link",
		title: null,
		url: "",
		children: []
	}, e);
}
function No(e) {
	this.config.enter.autolinkProtocol.call(this, e);
}
function Po(e) {
	this.config.exit.autolinkProtocol.call(this, e);
}
function Fo(e) {
	this.config.exit.data.call(this, e);
	let t = this.stack[this.stack.length - 1];
	t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Io(e) {
	this.config.exit.autolinkEmail.call(this, e);
}
function Lo(e) {
	this.exit(e);
}
function Ro(e) {
	wo(e, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, zo], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, Bo]], { ignore: ["link", "linkReference"] });
}
function zo(e, t, n, r, i) {
	let a = "";
	if (!Uo(i) || (/^w/i.test(t) && (n = t + n, t = "", a = "http://"), !Vo(n))) return !1;
	let o = Ho(n + r);
	if (!o[0]) return !1;
	let s = {
		type: "link",
		title: null,
		url: a + t + o[0],
		children: [{
			type: "text",
			value: t + o[0]
		}]
	};
	return o[1] ? [s, {
		type: "text",
		value: o[1]
	}] : s;
}
function Bo(e, t, n, r) {
	return !Uo(r, !0) || /[-\d_]$/.test(n) ? !1 : {
		type: "link",
		title: null,
		url: "mailto:" + t + "@" + n,
		children: [{
			type: "text",
			value: t + "@" + n
		}]
	};
}
function Vo(e) {
	let t = e.split(".");
	return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Ho(e) {
	let t = /[!"&'),.:;<>?\]}]+$/.exec(e);
	if (!t) return [e, void 0];
	e = e.slice(0, t.index);
	let n = t[0], r = n.indexOf(")"), i = So(e, "("), a = So(e, ")");
	for (; r !== -1 && i > a;) e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), a++;
	return [e, n];
}
function Uo(e, t) {
	let n = e.input.charCodeAt(e.index - 1);
	return (e.index === 0 || zt(n) || Rt(n)) && (!t || n !== 47);
}
//#endregion
//#region node_modules/mdast-util-gfm-footnote/lib/index.js
$o.peek = Qo;
function Wo() {
	this.buffer();
}
function Go(e) {
	this.enter({
		type: "footnoteReference",
		identifier: "",
		label: ""
	}, e);
}
function Ko() {
	this.buffer();
}
function qo(e) {
	this.enter({
		type: "footnoteDefinition",
		identifier: "",
		label: "",
		children: []
	}, e);
}
function Jo(e) {
	let t = this.resume(), n = this.stack[this.stack.length - 1];
	n.type, n.identifier = Mt(this.sliceSerialize(e)).toLowerCase(), n.label = t;
}
function Yo(e) {
	this.exit(e);
}
function Xo(e) {
	let t = this.resume(), n = this.stack[this.stack.length - 1];
	n.type, n.identifier = Mt(this.sliceSerialize(e)).toLowerCase(), n.label = t;
}
function Zo(e) {
	this.exit(e);
}
function Qo() {
	return "[";
}
function $o(e, t, n, r) {
	let i = n.createTracker(r), a = i.move("[^"), o = n.enter("footnoteReference"), s = n.enter("reference");
	return a += i.move(n.safe(n.associationId(e), {
		after: "]",
		before: a
	})), s(), o(), a += i.move("]"), a;
}
function es() {
	return {
		enter: {
			gfmFootnoteCallString: Wo,
			gfmFootnoteCall: Go,
			gfmFootnoteDefinitionLabelString: Ko,
			gfmFootnoteDefinition: qo
		},
		exit: {
			gfmFootnoteCallString: Jo,
			gfmFootnoteCall: Yo,
			gfmFootnoteDefinitionLabelString: Xo,
			gfmFootnoteDefinition: Zo
		}
	};
}
function ts(e) {
	let t = !1;
	return e && e.firstLineBlank && (t = !0), {
		handlers: {
			footnoteDefinition: n,
			footnoteReference: $o
		},
		unsafe: [{
			character: "[",
			inConstruct: [
				"label",
				"phrasing",
				"reference"
			]
		}]
	};
	function n(e, n, r, i) {
		let a = r.createTracker(i), o = a.move("[^"), s = r.enter("footnoteDefinition"), c = r.enter("label");
		return o += a.move(r.safe(r.associationId(e), {
			before: o,
			after: "]"
		})), c(), o += a.move("]:"), e.children && e.children.length > 0 && (a.shift(4), o += a.move((t ? "\n" : " ") + r.indentLines(r.containerFlow(e, a.current()), t ? rs : ns))), s(), o;
	}
}
function ns(e, t, n) {
	return t === 0 ? e : rs(e, t, n);
}
function rs(e, t, n) {
	return (n ? "" : "    ") + e;
}
//#endregion
//#region node_modules/mdast-util-gfm-strikethrough/lib/index.js
var is = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
ls.peek = us;
function as() {
	return {
		canContainEols: ["delete"],
		enter: { strikethrough: ss },
		exit: { strikethrough: cs }
	};
}
function os() {
	return {
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: is
		}],
		handlers: { delete: ls }
	};
}
function ss(e) {
	this.enter({
		type: "delete",
		children: []
	}, e);
}
function cs(e) {
	this.exit(e);
}
function ls(e, t, n, r) {
	let i = n.createTracker(r), a = n.enter("strikethrough"), o = i.move("~~");
	return o += n.containerPhrasing(e, {
		...i.current(),
		before: o,
		after: "~"
	}), o += i.move("~~"), a(), o;
}
function us() {
	return "~";
}
//#endregion
//#region node_modules/markdown-table/index.js
function ds(e) {
	return e.length;
}
function fs(e, t) {
	let n = t || {}, r = (n.align || []).concat(), i = n.stringLength || ds, a = [], o = [], s = [], c = [], l = 0, u = -1;
	for (; ++u < e.length;) {
		let t = [], r = [], a = -1;
		for (e[u].length > l && (l = e[u].length); ++a < e[u].length;) {
			let o = ps(e[u][a]);
			if (n.alignDelimiters !== !1) {
				let e = i(o);
				r[a] = e, (c[a] === void 0 || e > c[a]) && (c[a] = e);
			}
			t.push(o);
		}
		o[u] = t, s[u] = r;
	}
	let d = -1;
	if (typeof r == "object" && "length" in r) for (; ++d < l;) a[d] = ms(r[d]);
	else {
		let e = ms(r);
		for (; ++d < l;) a[d] = e;
	}
	d = -1;
	let f = [], p = [];
	for (; ++d < l;) {
		let e = a[d], t = "", r = "";
		e === 99 ? (t = ":", r = ":") : e === 108 ? t = ":" : e === 114 && (r = ":");
		let i = n.alignDelimiters === !1 ? 1 : Math.max(1, c[d] - t.length - r.length), o = t + "-".repeat(i) + r;
		n.alignDelimiters !== !1 && (i = t.length + i + r.length, i > c[d] && (c[d] = i), p[d] = i), f[d] = o;
	}
	o.splice(1, 0, f), s.splice(1, 0, p), u = -1;
	let m = [];
	for (; ++u < o.length;) {
		let e = o[u], t = s[u];
		d = -1;
		let r = [];
		for (; ++d < l;) {
			let i = e[d] || "", o = "", s = "";
			if (n.alignDelimiters !== !1) {
				let e = c[d] - (t[d] || 0), n = a[d];
				n === 114 ? o = " ".repeat(e) : n === 99 ? e % 2 ? (o = " ".repeat(e / 2 + .5), s = " ".repeat(e / 2 - .5)) : (o = " ".repeat(e / 2), s = o) : s = " ".repeat(e);
			}
			n.delimiterStart !== !1 && !d && r.push("|"), n.padding !== !1 && !(n.alignDelimiters === !1 && i === "") && (n.delimiterStart !== !1 || d) && r.push(" "), n.alignDelimiters !== !1 && r.push(o), r.push(i), n.alignDelimiters !== !1 && r.push(s), n.padding !== !1 && r.push(" "), (n.delimiterEnd !== !1 || d !== l - 1) && r.push("|");
		}
		m.push(n.delimiterEnd === !1 ? r.join("").replace(/ +$/, "") : r.join(""));
	}
	return m.join("\n");
}
function ps(e) {
	return e == null ? "" : String(e);
}
function ms(e) {
	let t = typeof e == "string" ? e.codePointAt(0) : 0;
	return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
function hs(e, t, n, r) {
	let i = n.enter("blockquote"), a = n.createTracker(r);
	a.move("> "), a.shift(2);
	let o = n.indentLines(n.containerFlow(e, a.current()), gs);
	return i(), o;
}
function gs(e, t, n) {
	return ">" + (n ? "" : " ") + e;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
function _s(e, t) {
	return vs(e, t.inConstruct, !0) && !vs(e, t.notInConstruct, !1);
}
function vs(e, t, n) {
	if (typeof t == "string" && (t = [t]), !t || t.length === 0) return n;
	let r = -1;
	for (; ++r < t.length;) if (e.includes(t[r])) return !0;
	return !1;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/break.js
function ys(e, t, n, r) {
	let i = -1;
	for (; ++i < n.unsafe.length;) if (n.unsafe[i].character === "\n" && _s(n.stack, n.unsafe[i])) return /[ \t]/.test(r.before) ? "" : " ";
	return "\\\n";
}
//#endregion
//#region node_modules/longest-streak/index.js
function bs(e, t) {
	let n = String(e), r = n.indexOf(t), i = r, a = 0, o = 0;
	if (typeof t != "string") throw TypeError("Expected substring");
	for (; r !== -1;) r === i ? ++a > o && (o = a) : a = 1, i = r + t.length, r = n.indexOf(t, i);
	return o;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
function xs(e, t) {
	return !!(t.options.fences === !1 && e.value && !e.lang && /[^ \r\n]/.test(e.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-fence.js
function Ss(e) {
	let t = e.options.fence || "`";
	if (t !== "`" && t !== "~") throw Error("Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/code.js
function Cs(e, t, n, r) {
	let i = Ss(n), a = e.value || "", o = i === "`" ? "GraveAccent" : "Tilde";
	if (xs(e, n)) {
		let e = n.enter("codeIndented"), t = n.indentLines(a, ws);
		return e(), t;
	}
	let s = n.createTracker(r), c = i.repeat(Math.max(bs(a, i) + 1, 3)), l = n.enter("codeFenced"), u = s.move(c);
	if (e.lang) {
		let t = n.enter(`codeFencedLang${o}`);
		u += s.move(n.safe(e.lang, {
			before: u,
			after: " ",
			encode: ["`"],
			...s.current()
		})), t();
	}
	if (e.lang && e.meta) {
		let t = n.enter(`codeFencedMeta${o}`);
		u += s.move(" "), u += s.move(n.safe(e.meta, {
			before: u,
			after: "\n",
			encode: ["`"],
			...s.current()
		})), t();
	}
	return u += s.move("\n"), a && (u += s.move(a + "\n")), u += s.move(c), l(), u;
}
function ws(e, t, n) {
	return (n ? "" : "    ") + e;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-quote.js
function Ts(e) {
	let t = e.options.quote || "\"";
	if (t !== "\"" && t !== "'") throw Error("Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/definition.js
function Es(e, t, n, r) {
	let i = Ts(n), a = i === "\"" ? "Quote" : "Apostrophe", o = n.enter("definition"), s = n.enter("label"), c = n.createTracker(r), l = c.move("[");
	return l += c.move(n.safe(n.associationId(e), {
		before: l,
		after: "]",
		...c.current()
	})), l += c.move("]: "), s(), !e.url || /[\0- \u007F]/.test(e.url) ? (s = n.enter("destinationLiteral"), l += c.move("<"), l += c.move(n.safe(e.url, {
		before: l,
		after: ">",
		...c.current()
	})), l += c.move(">")) : (s = n.enter("destinationRaw"), l += c.move(n.safe(e.url, {
		before: l,
		after: e.title ? " " : "\n",
		...c.current()
	}))), s(), e.title && (s = n.enter(`title${a}`), l += c.move(" " + i), l += c.move(n.safe(e.title, {
		before: l,
		after: i,
		...c.current()
	})), l += c.move(i), s()), o(), l;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
function Ds(e) {
	let t = e.options.emphasis || "*";
	if (t !== "*" && t !== "_") throw Error("Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
function Os(e) {
	return "&#x" + e.toString(16).toUpperCase() + ";";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/encode-info.js
function ks(e, t, n) {
	let r = Jt(e), i = Jt(t);
	return r === void 0 ? i === void 0 ? n === "_" ? {
		inside: !0,
		outside: !0
	} : {
		inside: !1,
		outside: !1
	} : i === 1 ? {
		inside: !0,
		outside: !0
	} : {
		inside: !1,
		outside: !0
	} : r === 1 ? i === void 0 ? {
		inside: !1,
		outside: !1
	} : i === 1 ? {
		inside: !0,
		outside: !0
	} : {
		inside: !1,
		outside: !1
	} : i === void 0 ? {
		inside: !1,
		outside: !1
	} : i === 1 ? {
		inside: !0,
		outside: !1
	} : {
		inside: !1,
		outside: !1
	};
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
As.peek = js;
function As(e, t, n, r) {
	let i = Ds(n), a = n.enter("emphasis"), o = n.createTracker(r), s = o.move(i), c = o.move(n.containerPhrasing(e, {
		after: i,
		before: s,
		...o.current()
	})), l = c.charCodeAt(0), u = ks(r.before.charCodeAt(r.before.length - 1), l, i);
	u.inside && (c = Os(l) + c.slice(1));
	let d = c.charCodeAt(c.length - 1), f = ks(r.after.charCodeAt(0), d, i);
	f.inside && (c = c.slice(0, -1) + Os(d));
	let p = o.move(i);
	return a(), n.attentionEncodeSurroundingInfo = {
		after: f.outside,
		before: u.outside
	}, s + c + p;
}
function js(e, t, n) {
	return n.options.emphasis || "*";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
function Ms(e, t) {
	let n = !1;
	return va(e, function(e) {
		if ("value" in e && /\r?\n|\r/.test(e.value) || e.type === "break") return n = !0, !1;
	}), !!((!e.depth || e.depth < 3) && yt(e) && (t.options.setext || n));
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/heading.js
function Ns(e, t, n, r) {
	let i = Math.max(Math.min(6, e.depth || 1), 1), a = n.createTracker(r);
	if (Ms(e, n)) {
		let t = n.enter("headingSetext"), r = n.enter("phrasing"), o = n.containerPhrasing(e, {
			...a.current(),
			before: "\n",
			after: "\n"
		});
		return r(), t(), o + "\n" + (i === 1 ? "=" : "-").repeat(o.length - (Math.max(o.lastIndexOf("\r"), o.lastIndexOf("\n")) + 1));
	}
	let o = "#".repeat(i), s = n.enter("headingAtx"), c = n.enter("phrasing");
	a.move(o + " ");
	let l = n.containerPhrasing(e, {
		before: "# ",
		after: "\n",
		...a.current()
	});
	return /^[\t ]/.test(l) && (l = Os(l.charCodeAt(0)) + l.slice(1)), l = l ? o + " " + l : o, n.options.closeAtx && (l += " " + o), c(), s(), l;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/html.js
Ps.peek = Fs;
function Ps(e) {
	return e.value || "";
}
function Fs() {
	return "<";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/image.js
Is.peek = Ls;
function Is(e, t, n, r) {
	let i = Ts(n), a = i === "\"" ? "Quote" : "Apostrophe", o = n.enter("image"), s = n.enter("label"), c = n.createTracker(r), l = c.move("![");
	return l += c.move(n.safe(e.alt, {
		before: l,
		after: "]",
		...c.current()
	})), l += c.move("]("), s(), !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (s = n.enter("destinationLiteral"), l += c.move("<"), l += c.move(n.safe(e.url, {
		before: l,
		after: ">",
		...c.current()
	})), l += c.move(">")) : (s = n.enter("destinationRaw"), l += c.move(n.safe(e.url, {
		before: l,
		after: e.title ? " " : ")",
		...c.current()
	}))), s(), e.title && (s = n.enter(`title${a}`), l += c.move(" " + i), l += c.move(n.safe(e.title, {
		before: l,
		after: i,
		...c.current()
	})), l += c.move(i), s()), l += c.move(")"), o(), l;
}
function Ls() {
	return "!";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
Rs.peek = zs;
function Rs(e, t, n, r) {
	let i = e.referenceType, a = n.enter("imageReference"), o = n.enter("label"), s = n.createTracker(r), c = s.move("!["), l = n.safe(e.alt, {
		before: c,
		after: "]",
		...s.current()
	});
	c += s.move(l + "]["), o();
	let u = n.stack;
	n.stack = [], o = n.enter("reference");
	let d = n.safe(n.associationId(e), {
		before: c,
		after: "]",
		...s.current()
	});
	return o(), n.stack = u, a(), i === "full" || !l || l !== d ? c += s.move(d + "]") : i === "shortcut" ? c = c.slice(0, -1) : c += s.move("]"), c;
}
function zs() {
	return "!";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
Bs.peek = Vs;
function Bs(e, t, n) {
	let r = e.value || "", i = "`", a = -1;
	for (; RegExp("(^|[^`])" + i + "([^`]|$)").test(r);) i += "`";
	for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++a < n.unsafe.length;) {
		let e = n.unsafe[a], t = n.compilePattern(e), i;
		if (e.atBreak) for (; i = t.exec(r);) {
			let e = i.index;
			r.charCodeAt(e) === 10 && r.charCodeAt(e - 1) === 13 && e--, r = r.slice(0, e) + " " + r.slice(i.index + 1);
		}
	}
	return i + r + i;
}
function Vs() {
	return "`";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
function Hs(e, t) {
	let n = yt(e);
	return !!(!t.options.resourceLink && e.url && !e.title && e.children && e.children.length === 1 && e.children[0].type === "text" && (n === e.url || "mailto:" + n === e.url) && /^[a-z][a-z+.-]+:/i.test(e.url) && !/[\0- <>\u007F]/.test(e.url));
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/link.js
Us.peek = Ws;
function Us(e, t, n, r) {
	let i = Ts(n), a = i === "\"" ? "Quote" : "Apostrophe", o = n.createTracker(r), s, c;
	if (Hs(e, n)) {
		let t = n.stack;
		n.stack = [], s = n.enter("autolink");
		let r = o.move("<");
		return r += o.move(n.containerPhrasing(e, {
			before: r,
			after: ">",
			...o.current()
		})), r += o.move(">"), s(), n.stack = t, r;
	}
	s = n.enter("link"), c = n.enter("label");
	let l = o.move("[");
	return l += o.move(n.containerPhrasing(e, {
		before: l,
		after: "](",
		...o.current()
	})), l += o.move("]("), c(), !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (c = n.enter("destinationLiteral"), l += o.move("<"), l += o.move(n.safe(e.url, {
		before: l,
		after: ">",
		...o.current()
	})), l += o.move(">")) : (c = n.enter("destinationRaw"), l += o.move(n.safe(e.url, {
		before: l,
		after: e.title ? " " : ")",
		...o.current()
	}))), c(), e.title && (c = n.enter(`title${a}`), l += o.move(" " + i), l += o.move(n.safe(e.title, {
		before: l,
		after: i,
		...o.current()
	})), l += o.move(i), c()), l += o.move(")"), s(), l;
}
function Ws(e, t, n) {
	return Hs(e, n) ? "<" : "[";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
Gs.peek = Ks;
function Gs(e, t, n, r) {
	let i = e.referenceType, a = n.enter("linkReference"), o = n.enter("label"), s = n.createTracker(r), c = s.move("["), l = n.containerPhrasing(e, {
		before: c,
		after: "]",
		...s.current()
	});
	c += s.move(l + "]["), o();
	let u = n.stack;
	n.stack = [], o = n.enter("reference");
	let d = n.safe(n.associationId(e), {
		before: c,
		after: "]",
		...s.current()
	});
	return o(), n.stack = u, a(), i === "full" || !l || l !== d ? c += s.move(d + "]") : i === "shortcut" ? c = c.slice(0, -1) : c += s.move("]"), c;
}
function Ks() {
	return "[";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
function qs(e) {
	let t = e.options.bullet || "*";
	if (t !== "*" && t !== "+" && t !== "-") throw Error("Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
function Js(e) {
	let t = qs(e), n = e.options.bulletOther;
	if (!n) return t === "*" ? "-" : "*";
	if (n !== "*" && n !== "+" && n !== "-") throw Error("Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
	if (n === t) throw Error("Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different");
	return n;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
function Ys(e) {
	let t = e.options.bulletOrdered || ".";
	if (t !== "." && t !== ")") throw Error("Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-rule.js
function Xs(e) {
	let t = e.options.rule || "*";
	if (t !== "*" && t !== "-" && t !== "_") throw Error("Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/list.js
function Zs(e, t, n, r) {
	let i = n.enter("list"), a = n.bulletCurrent, o = e.ordered ? Ys(n) : qs(n), s = e.ordered ? o === "." ? ")" : "." : Js(n), c = t && n.bulletLastUsed ? o === n.bulletLastUsed : !1;
	if (!e.ordered) {
		let t = e.children ? e.children[0] : void 0;
		if ((o === "*" || o === "-") && t && (!t.children || !t.children[0]) && n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (c = !0), Xs(n) === o && t) {
			let t = -1;
			for (; ++t < e.children.length;) {
				let n = e.children[t];
				if (n && n.type === "listItem" && n.children && n.children[0] && n.children[0].type === "thematicBreak") {
					c = !0;
					break;
				}
			}
		}
	}
	c && (o = s), n.bulletCurrent = o;
	let l = n.containerFlow(e, r);
	return n.bulletLastUsed = o, n.bulletCurrent = a, i(), l;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
function Qs(e) {
	let t = e.options.listItemIndent || "one";
	if (t !== "tab" && t !== "one" && t !== "mixed") throw Error("Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/list-item.js
function $s(e, t, n, r) {
	let i = Qs(n), a = n.bulletCurrent || qs(n);
	t && t.type === "list" && t.ordered && (a = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + a);
	let o = a.length + 1;
	(i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (o = Math.ceil(o / 4) * 4);
	let s = n.createTracker(r);
	s.move(a + " ".repeat(o - a.length)), s.shift(o);
	let c = n.enter("listItem"), l = n.indentLines(n.containerFlow(e, s.current()), u);
	return c(), l;
	function u(e, t, n) {
		return t ? (n ? "" : " ".repeat(o)) + e : (n ? a : a + " ".repeat(o - a.length)) + e;
	}
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
function ec(e, t, n, r) {
	let i = n.enter("paragraph"), a = n.enter("phrasing"), o = n.containerPhrasing(e, r);
	return a(), i(), o;
}
//#endregion
//#region node_modules/mdast-util-phrasing/lib/index.js
var tc = sa([
	"break",
	"delete",
	"emphasis",
	"footnote",
	"footnoteReference",
	"image",
	"imageReference",
	"inlineCode",
	"inlineMath",
	"link",
	"linkReference",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"strong",
	"text",
	"textDirective"
]);
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/root.js
function nc(e, t, n, r) {
	return (e.children.some(function(e) {
		return tc(e);
	}) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-strong.js
function rc(e) {
	let t = e.options.strong || "*";
	if (t !== "*" && t !== "_") throw Error("Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/strong.js
ic.peek = ac;
function ic(e, t, n, r) {
	let i = rc(n), a = n.enter("strong"), o = n.createTracker(r), s = o.move(i + i), c = o.move(n.containerPhrasing(e, {
		after: i,
		before: s,
		...o.current()
	})), l = c.charCodeAt(0), u = ks(r.before.charCodeAt(r.before.length - 1), l, i);
	u.inside && (c = Os(l) + c.slice(1));
	let d = c.charCodeAt(c.length - 1), f = ks(r.after.charCodeAt(0), d, i);
	f.inside && (c = c.slice(0, -1) + Os(d));
	let p = o.move(i + i);
	return a(), n.attentionEncodeSurroundingInfo = {
		after: f.outside,
		before: u.outside
	}, s + c + p;
}
function ac(e, t, n) {
	return n.options.strong || "*";
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/text.js
function oc(e, t, n, r) {
	return n.safe(e.value, r);
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
function sc(e) {
	let t = e.options.ruleRepetition || 3;
	if (t < 3) throw Error("Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more");
	return t;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
function cc(e, t, n) {
	let r = (Xs(n) + (n.options.ruleSpaces ? " " : "")).repeat(sc(n));
	return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/index.js
var lc = {
	blockquote: hs,
	break: ys,
	code: Cs,
	definition: Es,
	emphasis: As,
	hardBreak: ys,
	heading: Ns,
	html: Ps,
	image: Is,
	imageReference: Rs,
	inlineCode: Bs,
	link: Us,
	linkReference: Gs,
	list: Zs,
	listItem: $s,
	paragraph: ec,
	root: nc,
	strong: ic,
	text: oc,
	thematicBreak: cc
};
//#endregion
//#region node_modules/mdast-util-gfm-table/lib/index.js
function uc() {
	return {
		enter: {
			table: dc,
			tableData: hc,
			tableHeader: hc,
			tableRow: pc
		},
		exit: {
			codeText: gc,
			table: fc,
			tableData: mc,
			tableHeader: mc,
			tableRow: mc
		}
	};
}
function dc(e) {
	let t = e._align;
	this.enter({
		type: "table",
		align: t.map(function(e) {
			return e === "none" ? null : e;
		}),
		children: []
	}, e), this.data.inTable = !0;
}
function fc(e) {
	this.exit(e), this.data.inTable = void 0;
}
function pc(e) {
	this.enter({
		type: "tableRow",
		children: []
	}, e);
}
function mc(e) {
	this.exit(e);
}
function hc(e) {
	this.enter({
		type: "tableCell",
		children: []
	}, e);
}
function gc(e) {
	let t = this.resume();
	this.data.inTable && (t = t.replace(/\\([\\|])/g, _c));
	let n = this.stack[this.stack.length - 1];
	n.type, n.value = t, this.exit(e);
}
function _c(e, t) {
	return t === "|" ? t : e;
}
function vc(e) {
	let t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, a = n ? " " : "|";
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "tableCell"
			},
			{
				character: "\n",
				inConstruct: "tableCell"
			},
			{
				atBreak: !0,
				character: "|",
				after: "[	 :-]"
			},
			{
				character: "|",
				inConstruct: "tableCell"
			},
			{
				atBreak: !0,
				character: ":",
				after: "-"
			},
			{
				atBreak: !0,
				character: "-",
				after: "[:|-]"
			}
		],
		handlers: {
			inlineCode: f,
			table: o,
			tableCell: c,
			tableRow: s
		}
	};
	function o(e, t, n, r) {
		return l(u(e, n, r), e.align);
	}
	function s(e, t, n, r) {
		let i = l([d(e, n, r)]);
		return i.slice(0, i.indexOf("\n"));
	}
	function c(e, t, n, r) {
		let i = n.enter("tableCell"), o = n.enter("phrasing"), s = n.containerPhrasing(e, {
			...r,
			before: a,
			after: a
		});
		return o(), i(), s;
	}
	function l(e, t) {
		return fs(e, {
			align: t,
			alignDelimiters: r,
			padding: n,
			stringLength: i
		});
	}
	function u(e, t, n) {
		let r = e.children, i = -1, a = [], o = t.enter("table");
		for (; ++i < r.length;) a[i] = d(r[i], t, n);
		return o(), a;
	}
	function d(e, t, n) {
		let r = e.children, i = -1, a = [], o = t.enter("tableRow");
		for (; ++i < r.length;) a[i] = c(r[i], e, t, n);
		return o(), a;
	}
	function f(e, t, n) {
		let r = lc.inlineCode(e, t, n);
		return n.stack.includes("tableCell") && (r = r.replace(/\|/g, "\\$&")), r;
	}
}
//#endregion
//#region node_modules/mdast-util-gfm-task-list-item/lib/index.js
function yc() {
	return { exit: {
		taskListCheckValueChecked: xc,
		taskListCheckValueUnchecked: xc,
		paragraph: Sc
	} };
}
function bc() {
	return {
		unsafe: [{
			atBreak: !0,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: Cc }
	};
}
function xc(e) {
	let t = this.stack[this.stack.length - 2];
	t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function Sc(e) {
	let t = this.stack[this.stack.length - 2];
	if (t && t.type === "listItem" && typeof t.checked == "boolean") {
		let e = this.stack[this.stack.length - 1];
		e.type;
		let n = e.children[0];
		if (n && n.type === "text") {
			let r = t.children, i = -1, a;
			for (; ++i < r.length;) {
				let e = r[i];
				if (e.type === "paragraph") {
					a = e;
					break;
				}
			}
			a === e && (n.value = n.value.slice(1), n.value.length === 0 ? e.children.shift() : e.position && n.position && typeof n.position.start.offset == "number" && (n.position.start.column++, n.position.start.offset++, e.position.start = Object.assign({}, n.position.start)));
		}
	}
	this.exit(e);
}
function Cc(e, t, n, r) {
	let i = e.children[0], a = typeof e.checked == "boolean" && i && i.type === "paragraph", o = "[" + (e.checked ? "x" : " ") + "] ", s = n.createTracker(r);
	a && s.move(o);
	let c = lc.listItem(e, t, n, {
		...r,
		...s.current()
	});
	return a && (c = c.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, l)), c;
	function l(e) {
		return e + o;
	}
}
//#endregion
//#region node_modules/mdast-util-gfm/lib/index.js
function wc() {
	return [
		Ao(),
		es(),
		as(),
		uc(),
		yc()
	];
}
function Tc(e) {
	return { extensions: [
		jo(),
		ts(e),
		os(),
		vc(e),
		bc()
	] };
}
//#endregion
//#region node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
var Ec = {
	tokenize: Bc,
	partial: !0
}, Dc = {
	tokenize: Vc,
	partial: !0
}, Oc = {
	tokenize: Hc,
	partial: !0
}, kc = {
	tokenize: Uc,
	partial: !0
}, Ac = {
	tokenize: Wc,
	partial: !0
}, jc = {
	name: "wwwAutolink",
	tokenize: Rc,
	previous: Gc
}, Mc = {
	name: "protocolAutolink",
	tokenize: zc,
	previous: Kc
}, Nc = {
	name: "emailAutolink",
	tokenize: Lc,
	previous: qc
}, Pc = {};
function Fc() {
	return { text: Pc };
}
for (var Ic = 48; Ic < 123;) Pc[Ic] = Nc, Ic++, Ic === 58 ? Ic = 65 : Ic === 91 && (Ic = 97);
Pc[43] = Nc, Pc[45] = Nc, Pc[46] = Nc, Pc[95] = Nc, Pc[72] = [Nc, Mc], Pc[104] = [Nc, Mc], Pc[87] = [Nc, jc], Pc[119] = [Nc, jc];
function Lc(e, t, n) {
	let r = this, i, a;
	return o;
	function o(t) {
		return !Jc(t) || !qc.call(r, r.previous) || Yc(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), s(t));
	}
	function s(t) {
		return Jc(t) ? (e.consume(t), s) : t === 64 ? (e.consume(t), c) : n(t);
	}
	function c(t) {
		return t === 46 ? e.check(Ac, u, l)(t) : t === 45 || t === 95 || H(t) ? (a = !0, e.consume(t), c) : u(t);
	}
	function l(t) {
		return e.consume(t), i = !0, c;
	}
	function u(o) {
		return a && i && V(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(o)) : n(o);
	}
}
function Rc(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return t !== 87 && t !== 119 || !Gc.call(r, r.previous) || Yc(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(Ec, e.attempt(Dc, e.attempt(Oc, a), n), n)(t));
	}
	function a(n) {
		return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(n);
	}
}
function zc(e, t, n) {
	let r = this, i = "", a = !1;
	return o;
	function o(t) {
		return (t === 72 || t === 104) && Kc.call(r, r.previous) && !Yc(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(t), e.consume(t), s) : n(t);
	}
	function s(t) {
		if (V(t) && i.length < 5) return i += String.fromCodePoint(t), e.consume(t), s;
		if (t === 58) {
			let n = i.toLowerCase();
			if (n === "http" || n === "https") return e.consume(t), c;
		}
		return n(t);
	}
	function c(t) {
		return t === 47 ? (e.consume(t), a ? l : (a = !0, c)) : n(t);
	}
	function l(t) {
		return t === null || Pt(t) || W(t) || zt(t) || Rt(t) ? n(t) : e.attempt(Dc, e.attempt(Oc, u), n)(t);
	}
	function u(n) {
		return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(n);
	}
}
function Bc(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return (t === 87 || t === 119) && r < 3 ? (r++, e.consume(t), i) : t === 46 && r === 3 ? (e.consume(t), a) : n(t);
	}
	function a(e) {
		return e === null ? n(e) : t(e);
	}
}
function Vc(e, t, n) {
	let r, i, a;
	return o;
	function o(t) {
		return t === 46 || t === 95 ? e.check(kc, c, s)(t) : t === null || W(t) || zt(t) || t !== 45 && Rt(t) ? c(t) : (a = !0, e.consume(t), o);
	}
	function s(t) {
		return t === 95 ? r = !0 : (i = r, r = void 0), e.consume(t), o;
	}
	function c(e) {
		return i || r || !a ? n(e) : t(e);
	}
}
function Hc(e, t) {
	let n = 0, r = 0;
	return i;
	function i(o) {
		return o === 40 ? (n++, e.consume(o), i) : o === 41 && r < n ? a(o) : o === 33 || o === 34 || o === 38 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 60 || o === 63 || o === 93 || o === 95 || o === 126 ? e.check(kc, t, a)(o) : o === null || W(o) || zt(o) ? t(o) : (e.consume(o), i);
	}
	function a(t) {
		return t === 41 && r++, e.consume(t), i;
	}
}
function Uc(e, t, n) {
	return r;
	function r(o) {
		return o === 33 || o === 34 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 63 || o === 95 || o === 126 ? (e.consume(o), r) : o === 38 ? (e.consume(o), a) : o === 93 ? (e.consume(o), i) : o === 60 || o === null || W(o) || zt(o) ? t(o) : n(o);
	}
	function i(e) {
		return e === null || e === 40 || e === 91 || W(e) || zt(e) ? t(e) : r(e);
	}
	function a(e) {
		return V(e) ? o(e) : n(e);
	}
	function o(t) {
		return t === 59 ? (e.consume(t), r) : V(t) ? (e.consume(t), o) : n(t);
	}
}
function Wc(e, t, n) {
	return r;
	function r(t) {
		return e.consume(t), i;
	}
	function i(e) {
		return H(e) ? n(e) : t(e);
	}
}
function Gc(e) {
	return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || W(e);
}
function Kc(e) {
	return !V(e);
}
function qc(e) {
	return !(e === 47 || Jc(e));
}
function Jc(e) {
	return e === 43 || e === 45 || e === 46 || e === 95 || H(e);
}
function Yc(e) {
	let t = e.length, n = !1;
	for (; t--;) {
		let r = e[t][1];
		if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
			n = !0;
			break;
		}
		if (r._gfmAutolinkLiteralWalkedInto) {
			n = !1;
			break;
		}
	}
	return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
//#endregion
//#region node_modules/micromark-extension-gfm-footnote/lib/syntax.js
var Xc = {
	tokenize: il,
	partial: !0
};
function Zc() {
	return {
		document: { 91: {
			name: "gfmFootnoteDefinition",
			tokenize: tl,
			continuation: { tokenize: nl },
			exit: rl
		} },
		text: {
			91: {
				name: "gfmFootnoteCall",
				tokenize: el
			},
			93: {
				name: "gfmPotentialFootnoteCall",
				add: "after",
				tokenize: Qc,
				resolveTo: $c
			}
		}
	};
}
function Qc(e, t, n) {
	let r = this, i = r.events.length, a = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), o;
	for (; i--;) {
		let e = r.events[i][1];
		if (e.type === "labelImage") {
			o = e;
			break;
		}
		if (e.type === "gfmFootnoteCall" || e.type === "labelLink" || e.type === "label" || e.type === "image" || e.type === "link") break;
	}
	return s;
	function s(i) {
		if (!o || !o._balanced) return n(i);
		let s = Mt(r.sliceSerialize({
			start: o.end,
			end: r.now()
		}));
		return s.codePointAt(0) !== 94 || !a.includes(s.slice(1)) ? n(i) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(i), e.exit("gfmFootnoteCallLabelMarker"), t(i));
	}
}
function $c(e, t) {
	let n = e.length;
	for (; n--;) if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
		e[n][1];
		break;
	}
	e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
	let r = {
		type: "gfmFootnoteCall",
		start: Object.assign({}, e[n + 3][1].start),
		end: Object.assign({}, e[e.length - 1][1].end)
	}, i = {
		type: "gfmFootnoteCallMarker",
		start: Object.assign({}, e[n + 3][1].end),
		end: Object.assign({}, e[n + 3][1].end)
	};
	i.end.column++, i.end.offset++, i.end._bufferIndex++;
	let a = {
		type: "gfmFootnoteCallString",
		start: Object.assign({}, i.end),
		end: Object.assign({}, e[e.length - 1][1].start)
	}, o = {
		type: "chunkString",
		contentType: "string",
		start: Object.assign({}, a.start),
		end: Object.assign({}, a.end)
	}, s = [
		e[n + 1],
		e[n + 2],
		[
			"enter",
			r,
			t
		],
		e[n + 3],
		e[n + 4],
		[
			"enter",
			i,
			t
		],
		[
			"exit",
			i,
			t
		],
		[
			"enter",
			a,
			t
		],
		[
			"enter",
			o,
			t
		],
		[
			"exit",
			o,
			t
		],
		[
			"exit",
			a,
			t
		],
		e[e.length - 2],
		e[e.length - 1],
		[
			"exit",
			r,
			t
		]
	];
	return e.splice(n, e.length - n + 1, ...s), e;
}
function el(e, t, n) {
	let r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), a = 0, o;
	return s;
	function s(t) {
		return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(t), e.exit("gfmFootnoteCallLabelMarker"), c;
	}
	function c(t) {
		return t === 94 ? (e.enter("gfmFootnoteCallMarker"), e.consume(t), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", l) : n(t);
	}
	function l(s) {
		if (a > 999 || s === 93 && !o || s === null || s === 91 || W(s)) return n(s);
		if (s === 93) {
			e.exit("chunkString");
			let a = e.exit("gfmFootnoteCallString");
			return i.includes(Mt(r.sliceSerialize(a))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(s), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(s);
		}
		return W(s) || (o = !0), a++, e.consume(s), s === 92 ? u : l;
	}
	function u(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), a++, l) : l(t);
	}
}
function tl(e, t, n) {
	let r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), a, o = 0, s;
	return c;
	function c(t) {
		return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), l;
	}
	function l(t) {
		return t === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", u) : n(t);
	}
	function u(t) {
		if (o > 999 || t === 93 && !s || t === null || t === 91 || W(t)) return n(t);
		if (t === 93) {
			e.exit("chunkString");
			let n = e.exit("gfmFootnoteDefinitionLabelString");
			return a = Mt(r.sliceSerialize(n)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), f;
		}
		return W(t) || (s = !0), o++, e.consume(t), t === 92 ? d : u;
	}
	function d(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), o++, u) : u(t);
	}
	function f(t) {
		return t === 58 ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), i.includes(a) || i.push(a), K(e, p, "gfmFootnoteDefinitionWhitespace")) : n(t);
	}
	function p(e) {
		return t(e);
	}
}
function nl(e, t, n) {
	return e.check(nn, t, e.attempt(Xc, t, n));
}
function rl(e) {
	e.exit("gfmFootnoteDefinition");
}
function il(e, t, n) {
	let r = this;
	return K(e, i, "gfmFootnoteDefinitionIndent", 5);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return i && i[1].type === "gfmFootnoteDefinitionIndent" && i[2].sliceSerialize(i[1], !0).length === 4 ? t(e) : n(e);
	}
}
//#endregion
//#region node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
function al(e) {
	let t = (e || {}).singleTilde, n = {
		name: "strikethrough",
		tokenize: i,
		resolveAll: r
	};
	return t ??= !0, {
		text: { 126: n },
		insideSpan: { null: [n] },
		attentionMarkers: { null: [126] }
	};
	function r(e, t) {
		let n = -1;
		for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "strikethroughSequenceTemporary" && e[n][1]._close) {
			let r = n;
			for (; r--;) if (e[r][0] === "exit" && e[r][1].type === "strikethroughSequenceTemporary" && e[r][1]._open && e[n][1].end.offset - e[n][1].start.offset === e[r][1].end.offset - e[r][1].start.offset) {
				e[n][1].type = "strikethroughSequence", e[r][1].type = "strikethroughSequence";
				let i = {
					type: "strikethrough",
					start: Object.assign({}, e[r][1].start),
					end: Object.assign({}, e[n][1].end)
				}, a = {
					type: "strikethroughText",
					start: Object.assign({}, e[r][1].end),
					end: Object.assign({}, e[n][1].start)
				}, o = [
					[
						"enter",
						i,
						t
					],
					[
						"enter",
						e[r][1],
						t
					],
					[
						"exit",
						e[r][1],
						t
					],
					[
						"enter",
						a,
						t
					]
				], s = t.parser.constructs.insideSpan.null;
				s && Tt(o, o.length, 0, Yt(s, e.slice(r + 1, n), t)), Tt(o, o.length, 0, [
					[
						"exit",
						a,
						t
					],
					[
						"enter",
						e[n][1],
						t
					],
					[
						"exit",
						e[n][1],
						t
					],
					[
						"exit",
						i,
						t
					]
				]), Tt(e, r - 1, n - r + 3, o), n = r + o.length - 2;
				break;
			}
		}
		for (n = -1; ++n < e.length;) e[n][1].type === "strikethroughSequenceTemporary" && (e[n][1].type = "data");
		return e;
	}
	function i(e, n, r) {
		let i = this.previous, a = this.events, o = 0;
		return s;
		function s(t) {
			return i === 126 && a[a.length - 1][1].type !== "characterEscape" ? r(t) : (e.enter("strikethroughSequenceTemporary"), c(t));
		}
		function c(a) {
			let s = Jt(i);
			if (a === 126) return o > 1 ? r(a) : (e.consume(a), o++, c);
			if (o < 2 && !t) return r(a);
			let l = e.exit("strikethroughSequenceTemporary"), u = Jt(a);
			return l._open = !u || u === 2 && !!s, l._close = !s || s === 2 && !!u, n(a);
		}
	}
}
//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/edit-map.js
var ol = class {
	constructor() {
		this.map = [];
	}
	add(e, t, n) {
		sl(this, e, t, n);
	}
	consume(e) {
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.sort(function(e, t) {
			return e[0] - t[0];
		}), this.map.length === 0) return;
		let t = this.map.length, n = [];
		for (; t > 0;) --t, n.push(e.slice(this.map[t][0] + this.map[t][1]), this.map[t][2]), e.length = this.map[t][0];
		n.push(e.slice()), e.length = 0;
		let r = n.pop();
		for (; r;) {
			for (let t of r) e.push(t);
			r = n.pop();
		}
		this.map.length = 0;
	}
};
function sl(e, t, n, r) {
	let i = 0;
	if (!(n === 0 && r.length === 0)) {
		for (; i < e.map.length;) {
			if (e.map[i][0] === t) {
				e.map[i][1] += n, e.map[i][2].push(...r);
				return;
			}
			i += 1;
		}
		e.map.push([
			t,
			n,
			r
		]);
	}
}
//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/infer.js
function cl(e, t) {
	let n = !1, r = [];
	for (; t < e.length;) {
		let i = e[t];
		if (n) {
			if (i[0] === "enter") i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			else if (i[1].type === "tableContent") {
				if (e[t - 1][1].type === "tableDelimiterMarker") {
					let e = r.length - 1;
					r[e] = r[e] === "left" ? "center" : "right";
				}
			} else if (i[1].type === "tableDelimiterRow") break;
		} else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
		t += 1;
	}
	return r;
}
//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/syntax.js
function ll() {
	return { flow: { null: {
		name: "table",
		tokenize: ul,
		resolveAll: dl
	} } };
}
function ul(e, t, n) {
	let r = this, i = 0, a = 0, o;
	return s;
	function s(e) {
		let t = r.events.length - 1;
		for (; t > -1;) {
			let e = r.events[t][1].type;
			if (e === "lineEnding" || e === "linePrefix") t--;
			else break;
		}
		let i = t > -1 ? r.events[t][1].type : null, a = i === "tableHead" || i === "tableRow" ? S : c;
		return a === S && r.parser.lazy[r.now().line] ? n(e) : a(e);
	}
	function c(t) {
		return e.enter("tableHead"), e.enter("tableRow"), l(t);
	}
	function l(e) {
		return e === 124 ? u(e) : (o = !0, a += 1, u(e));
	}
	function u(t) {
		return t === null ? n(t) : U(t) ? a > 1 ? (a = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), p) : n(t) : G(t) ? K(e, u, "whitespace")(t) : (a += 1, o && (o = !1, i += 1), t === 124 ? (e.enter("tableCellDivider"), e.consume(t), e.exit("tableCellDivider"), o = !0, u) : (e.enter("data"), d(t)));
	}
	function d(t) {
		return t === null || t === 124 || W(t) ? (e.exit("data"), u(t)) : (e.consume(t), t === 92 ? f : d);
	}
	function f(t) {
		return t === 92 || t === 124 ? (e.consume(t), d) : d(t);
	}
	function p(t) {
		return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(t) : (e.enter("tableDelimiterRow"), o = !1, G(t) ? K(e, m, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : m(t));
	}
	function m(t) {
		return t === 45 || t === 58 ? g(t) : t === 124 ? (o = !0, e.enter("tableCellDivider"), e.consume(t), e.exit("tableCellDivider"), h) : x(t);
	}
	function h(t) {
		return G(t) ? K(e, g, "whitespace")(t) : g(t);
	}
	function g(t) {
		return t === 58 ? (a += 1, o = !0, e.enter("tableDelimiterMarker"), e.consume(t), e.exit("tableDelimiterMarker"), _) : t === 45 ? (a += 1, _(t)) : t === null || U(t) ? b(t) : x(t);
	}
	function _(t) {
		return t === 45 ? (e.enter("tableDelimiterFiller"), v(t)) : x(t);
	}
	function v(t) {
		return t === 45 ? (e.consume(t), v) : t === 58 ? (o = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(t), e.exit("tableDelimiterMarker"), y) : (e.exit("tableDelimiterFiller"), y(t));
	}
	function y(t) {
		return G(t) ? K(e, b, "whitespace")(t) : b(t);
	}
	function b(n) {
		return n === 124 ? m(n) : n === null || U(n) ? !o || i !== a ? x(n) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(n)) : x(n);
	}
	function x(e) {
		return n(e);
	}
	function S(t) {
		return e.enter("tableRow"), C(t);
	}
	function C(n) {
		return n === 124 ? (e.enter("tableCellDivider"), e.consume(n), e.exit("tableCellDivider"), C) : n === null || U(n) ? (e.exit("tableRow"), t(n)) : G(n) ? K(e, C, "whitespace")(n) : (e.enter("data"), w(n));
	}
	function w(t) {
		return t === null || t === 124 || W(t) ? (e.exit("data"), C(t)) : (e.consume(t), t === 92 ? T : w);
	}
	function T(t) {
		return t === 92 || t === 124 ? (e.consume(t), w) : w(t);
	}
}
function dl(e, t) {
	let n = -1, r = !0, i = 0, a = [
		0,
		0,
		0,
		0
	], o = [
		0,
		0,
		0,
		0
	], s = !1, c = 0, l, u, d, f = new ol();
	for (; ++n < e.length;) {
		let p = e[n], m = p[1];
		p[0] === "enter" ? m.type === "tableHead" ? (s = !1, c !== 0 && (pl(f, t, c, l, u), u = void 0, c = 0), l = {
			type: "table",
			start: Object.assign({}, m.start),
			end: Object.assign({}, m.end)
		}, f.add(n, 0, [[
			"enter",
			l,
			t
		]])) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (r = !0, d = void 0, a = [
			0,
			0,
			0,
			0
		], o = [
			0,
			n + 1,
			0,
			0
		], s && (s = !1, u = {
			type: "tableBody",
			start: Object.assign({}, m.start),
			end: Object.assign({}, m.end)
		}, f.add(n, 0, [[
			"enter",
			u,
			t
		]])), i = m.type === "tableDelimiterRow" ? 2 : u ? 3 : 1) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") ? (r = !1, o[2] === 0 && (a[1] !== 0 && (o[0] = o[1], d = fl(f, t, a, i, void 0, d), a = [
			0,
			0,
			0,
			0
		]), o[2] = n)) : m.type === "tableCellDivider" && (r ? r = !1 : (a[1] !== 0 && (o[0] = o[1], d = fl(f, t, a, i, void 0, d)), a = o, o = [
			a[1],
			n,
			0,
			0
		])) : m.type === "tableHead" ? (s = !0, c = n) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (c = n, a[1] === 0 ? o[1] !== 0 && (d = fl(f, t, o, i, n, d)) : (o[0] = o[1], d = fl(f, t, a, i, n, d)), i = 0) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") && (o[3] = n);
	}
	for (c !== 0 && pl(f, t, c, l, u), f.consume(t.events), n = -1; ++n < t.events.length;) {
		let e = t.events[n];
		e[0] === "enter" && e[1].type === "table" && (e[1]._align = cl(t.events, n));
	}
	return e;
}
function fl(e, t, n, r, i, a) {
	let o = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData";
	n[0] !== 0 && (a.end = Object.assign({}, ml(t.events, n[0])), e.add(n[0], 0, [[
		"exit",
		a,
		t
	]]));
	let s = ml(t.events, n[1]);
	if (a = {
		type: o,
		start: Object.assign({}, s),
		end: Object.assign({}, s)
	}, e.add(n[1], 0, [[
		"enter",
		a,
		t
	]]), n[2] !== 0) {
		let i = ml(t.events, n[2]), a = ml(t.events, n[3]), o = {
			type: "tableContent",
			start: Object.assign({}, i),
			end: Object.assign({}, a)
		};
		if (e.add(n[2], 0, [[
			"enter",
			o,
			t
		]]), r !== 2) {
			let r = t.events[n[2]], i = t.events[n[3]];
			if (r[1].end = Object.assign({}, i[1].end), r[1].type = "chunkText", r[1].contentType = "text", n[3] > n[2] + 1) {
				let t = n[2] + 1, r = n[3] - n[2] - 1;
				e.add(t, r, []);
			}
		}
		e.add(n[3] + 1, 0, [[
			"exit",
			o,
			t
		]]);
	}
	return i !== void 0 && (a.end = Object.assign({}, ml(t.events, i)), e.add(i, 0, [[
		"exit",
		a,
		t
	]]), a = void 0), a;
}
function pl(e, t, n, r, i) {
	let a = [], o = ml(t.events, n);
	i && (i.end = Object.assign({}, o), a.push([
		"exit",
		i,
		t
	])), r.end = Object.assign({}, o), a.push([
		"exit",
		r,
		t
	]), e.add(n + 1, 0, a);
}
function ml(e, t) {
	let n = e[t], r = n[0] === "enter" ? "start" : "end";
	return n[1][r];
}
//#endregion
//#region node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
var hl = {
	name: "tasklistCheck",
	tokenize: _l
};
function gl() {
	return { text: { 91: hl } };
}
function _l(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return r.previous !== null || !r._gfmTasklistFirstContentOfListItem ? n(t) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(t), e.exit("taskListCheckMarker"), a);
	}
	function a(t) {
		return W(t) ? (e.enter("taskListCheckValueUnchecked"), e.consume(t), e.exit("taskListCheckValueUnchecked"), o) : t === 88 || t === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(t), e.exit("taskListCheckValueChecked"), o) : n(t);
	}
	function o(t) {
		return t === 93 ? (e.enter("taskListCheckMarker"), e.consume(t), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), s) : n(t);
	}
	function s(r) {
		return U(r) ? t(r) : G(r) ? e.check({ tokenize: vl }, t, n)(r) : n(r);
	}
}
function vl(e, t, n) {
	return K(e, r, "whitespace");
	function r(e) {
		return e === null ? n(e) : t(e);
	}
}
//#endregion
//#region node_modules/micromark-extension-gfm/index.js
function yl(e) {
	return Ot([
		Fc(),
		Zc(),
		al(e),
		ll(),
		gl()
	]);
}
//#endregion
//#region node_modules/remark-gfm/lib/index.js
var bl = {};
function xl(e) {
	let t = this, n = e || bl, r = t.data(), i = r.micromarkExtensions ||= [], a = r.fromMarkdownExtensions ||= [], o = r.toMarkdownExtensions ||= [];
	i.push(yl(n)), a.push(wc()), o.push(Tc(n));
}
//#endregion
//#region src/utils/parseBlocks.js
var Sl = 1;
function Cl() {
	return `b${Sl++}`;
}
var wl = /^(-{3,}|\*{3,}|_{3,})\s*$/, Tl = /^#{1,6}\s/, El = /^(\s*)([-*+]|\d+[.)])\s/, Dl = /^\|.+\|/, Ol = /^> \[!\w+\]/, kl = /^>\s/;
function Al(e) {
	Sl = 1;
	let t = e.split("\n"), n = [], r = 0;
	if (t[0]?.trim() === "---") {
		let e = t.indexOf("---", 1);
		e !== -1 && (n.push({
			id: Cl(),
			type: "frontmatter",
			content: t.slice(0, e + 1).join("\n")
		}), r = e + 1);
	}
	function i(e) {
		if (!e.length) return;
		let t = e.join("\n"), r = e[0], i = a(r);
		n.push({
			id: Cl(),
			type: i,
			content: t
		}), e.length = 0;
	}
	function a(e) {
		return wl.test(e) ? "thematic-break" : Tl.test(e) ? "heading" : e.trim().startsWith("```") ? "fenced-code" : Dl.test(e) ? "table" : Ol.test(e) ? "callout" : kl.test(e) ? "blockquote" : El.test(e) ? "list" : "paragraph";
	}
	let o = [], s = !1;
	for (; r < t.length; r++) {
		let e = t[r];
		if (e.trim().startsWith("```")) {
			s ? (o.push(e), i(o), s = !1, o = []) : (i(o), s = !0, o = [e]);
			continue;
		}
		if (s) {
			o.push(e);
			continue;
		}
		if (e.trim() === "") {
			i(o);
			continue;
		}
		if (Dl.test(e)) {
			o.length && a(o[0]) !== "table" && i(o), o.push(e);
			continue;
		}
		if (Ol.test(e)) {
			for (i(o), o = [e]; r + 1 < t.length && t[r + 1].startsWith("> ");) r++, o.push(t[r]);
			i(o), o = [];
			continue;
		}
		if (kl.test(e)) {
			o.length && a(o[0]) !== "blockquote" && i(o), o.push(e);
			continue;
		}
		if (El.test(e)) {
			o.length && a(o[0]) !== "list" && i(o), o.push(e);
			continue;
		}
		if (wl.test(e) || Tl.test(e)) {
			i(o), n.push({
				id: Cl(),
				type: a(e),
				content: e
			});
			continue;
		}
		o.length && a(o[0]) !== "paragraph" && i(o), o.push(e);
	}
	return i(o), n.length ? n : [{
		id: Cl(),
		type: "paragraph",
		content: ""
	}];
}
//#endregion
//#region src/components/Callout.jsx
var jl = {
	note: {
		border: "border-l-blue-500",
		bg: "bg-blue-500/5",
		text: "text-blue-400"
	},
	tip: {
		border: "border-l-teal-500",
		bg: "bg-teal-500/5",
		text: "text-teal-400"
	},
	info: {
		border: "border-l-cyan-500",
		bg: "bg-cyan-500/5",
		text: "text-cyan-400"
	},
	warning: {
		border: "border-l-amber-500",
		bg: "bg-amber-500/5",
		text: "text-amber-400"
	},
	danger: {
		border: "border-l-red-500",
		bg: "bg-red-500/10",
		text: "text-red-400"
	},
	example: {
		border: "border-l-purple-500",
		bg: "bg-purple-500/5",
		text: "text-purple-400"
	},
	abstract: {
		border: "border-l-teal-500",
		bg: "bg-teal-500/5",
		text: "text-teal-400"
	},
	todo: {
		border: "border-l-sky-500",
		bg: "bg-sky-500/5",
		text: "text-sky-400"
	},
	success: {
		border: "border-l-green-500",
		bg: "bg-green-500/5",
		text: "text-green-400"
	},
	question: {
		border: "border-l-yellow-500",
		bg: "bg-yellow-500/5",
		text: "text-yellow-400"
	},
	failure: {
		border: "border-l-red-500",
		bg: "bg-red-500/10",
		text: "text-red-400"
	},
	bug: {
		border: "border-l-red-500",
		bg: "bg-red-500/10",
		text: "text-red-400"
	},
	quote: {
		border: "border-l-zinc-500",
		bg: "bg-zinc-500/5",
		text: "text-zinc-400"
	}
}, Ml = {
	note: "Note",
	tip: "Tip",
	info: "Info",
	warning: "Warning",
	danger: "Danger",
	example: "Example",
	abstract: "Abstract",
	todo: "Todo",
	success: "Success",
	question: "Question",
	failure: "Failure",
	bug: "Bug",
	quote: "Quote"
};
function Nl({ type: e, title: t, children: n }) {
	let r = jl[e] || jl.note, i = Ml[e] || e;
	return /* @__PURE__ */ B("div", {
		className: `my-6 border-l-4 ${r.border} ${r.bg} rounded-r-lg px-5 py-4`,
		children: [/* @__PURE__ */ z("div", {
			className: `text-sm font-bold tracking-wide uppercase mb-2 ${r.text}`,
			children: t || i
		}), /* @__PURE__ */ z("div", {
			className: "text-zinc-300 leading-relaxed",
			children: n
		})]
	});
}
//#endregion
//#region src/components/MarkdownEditor.jsx
function Pl(e) {
	let t = e.split("\n").slice(1, -1), n = {};
	for (let e of t) {
		let t = e.indexOf(":");
		t !== -1 && (n[e.slice(0, t).trim()] = e.slice(t + 1).trim());
	}
	return n;
}
function Fl({ raw: e }) {
	let t = Pl(e), n = Object.keys(t);
	return n.length ? /* @__PURE__ */ z("div", {
		className: "rounded-lg border border-zinc-800 bg-white/[0.02] px-5 py-4 font-mono text-sm",
		children: n.map((e) => /* @__PURE__ */ B("div", {
			className: "flex gap-4 py-0.5",
			children: [/* @__PURE__ */ z("span", {
				className: "text-zinc-500 shrink-0",
				children: e
			}), /* @__PURE__ */ z("span", {
				className: "text-zinc-300",
				children: t[e]
			})]
		}, e))
	}) : null;
}
var Il = [
	"strong",
	"em",
	"del",
	"a",
	"code",
	"img",
	"br",
	"sub",
	"sup"
];
function Ll({ children: e }) {
	return /* @__PURE__ */ z(_o, {
		remarkPlugins: [xl],
		allowedElements: Il,
		unwrapDisallowed: !0,
		children: e
	});
}
var Rl = /^\[!(\w+)\]\s*(.*)/;
function zl(e) {
	let t = e.replace(/^>\s*/, "").match(Rl);
	if (!t) return {
		type: "note",
		title: "Note"
	};
	let n = t[1].toLowerCase();
	return {
		type: n,
		title: t[2] || n.charAt(0).toUpperCase() + n.slice(1)
	};
}
function Bl({ block: e }) {
	let { type: t, content: n } = e;
	switch (t) {
		case "frontmatter": return /* @__PURE__ */ z(Fl, { raw: n });
		case "heading": {
			let e = n.match(/^#+/)?.[0]?.length || 1, t = n.replace(/^#+\s*/, ""), r = {
				1: "text-3xl font-extrabold",
				2: "text-2xl font-bold",
				3: "text-xl font-semibold",
				4: "text-lg font-semibold",
				5: "text-base font-semibold",
				6: "text-sm font-semibold"
			};
			return /* @__PURE__ */ z("div", {
				className: `markdown-block markdown-block--heading markdown-block--heading-${e} ${r[e] || r[1]} text-white leading-snug`,
				children: /* @__PURE__ */ z(Ll, { children: t })
			});
		}
		case "paragraph": return /* @__PURE__ */ z("div", {
			className: "markdown-block markdown-block--paragraph text-zinc-300 leading-relaxed",
			children: /* @__PURE__ */ z(Ll, { children: n })
		});
		case "fenced-code": {
			let e = n.split("\n")[0].replace(/```\s*/, ""), t = n.split("\n").slice(1, -1).join("\n");
			return /* @__PURE__ */ B("pre", {
				className: "markdown-block markdown-block--code bg-white/5 border border-zinc-800 rounded-lg p-5 overflow-x-auto",
				children: [e && /* @__PURE__ */ z("div", {
					className: "text-xs text-zinc-500 mb-2 uppercase tracking-wider",
					children: e
				}), /* @__PURE__ */ z("code", {
					className: "text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre",
					children: t
				})]
			});
		}
		case "table": return /* @__PURE__ */ z("div", {
			className: "markdown-block markdown-block--table overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-zinc-700 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:text-white [&_th]:bg-white/[0.04] [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:text-zinc-300 [&_tr:nth-child(even)]:bg-white/[0.02]",
			children: /* @__PURE__ */ z(_o, {
				remarkPlugins: [xl],
				children: n
			})
		});
		case "callout": {
			let e = n.split("\n"), t = zl(e[0]), r = [e[0].replace(/^>\s*\[!\w+\]\s*/, ""), ...e.slice(1).map((e) => e.replace(/^>\s?/, ""))].join("\n");
			return /* @__PURE__ */ z(Nl, {
				type: t.type,
				title: t.title,
				children: /* @__PURE__ */ z(_o, {
					remarkPlugins: [xl],
					children: r
				})
			});
		}
		case "blockquote": return /* @__PURE__ */ z("blockquote", {
			className: "markdown-block markdown-block--quote border-l-2 border-zinc-600 pl-4 italic text-zinc-400 leading-relaxed",
			children: /* @__PURE__ */ z(Ll, { children: n.split("\n").map((e) => e.replace(/^>\s?/, "")).join("\n") })
		});
		case "list": return /* @__PURE__ */ z("div", {
			className: "markdown-block markdown-block--list text-zinc-300 leading-relaxed",
			children: /* @__PURE__ */ z(_o, {
				remarkPlugins: [xl],
				allowedElements: [
					"ul",
					"ol",
					"li",
					"strong",
					"em",
					"del",
					"a",
					"code",
					"img",
					"br",
					"sub",
					"sup"
				],
				children: n
			})
		});
		case "thematic-break": return /* @__PURE__ */ z("hr", { className: "border-zinc-800 my-2" });
		default: return /* @__PURE__ */ z("div", {
			className: "markdown-block markdown-block--paragraph text-zinc-300 leading-relaxed",
			children: /* @__PURE__ */ z(Ll, { children: n })
		});
	}
}
function Vl({ value: e, onChange: t, editorRef: n, editing: r, onUploadImage: i }) {
	let [a, o] = _(!1), [s, c] = _(""), [l, u] = _(e), [d, m] = _(!1), [v, y] = _(!1), b = g(0), x = g(null), S = g(null), C = g(null), w = a ? s : r ? l : e, T = h(() => Al(w), [w]), E = f((e) => e.map((e) => e.content).join("\n\n"), []), D = f(() => r ? l : E(T), [
		T,
		l,
		r,
		E
	]);
	p(() => {
		n && (n.current = { getContent: D });
	}, [n, D]), p(() => {
		if (!r) return;
		let e = (e) => {
			Array.from(e.dataTransfer?.types || []).includes("Files") && e.preventDefault();
		};
		return window.addEventListener("dragover", e), window.addEventListener("drop", e), () => {
			window.removeEventListener("dragover", e), window.removeEventListener("drop", e);
		};
	}, [r]), p(() => {
		let e = S.current;
		e && a && (e.style.height = "auto", e.style.height = e.scrollHeight + "px");
	}, [s, a]), p(() => {
		if (a && S.current) {
			let e = S.current;
			e.focus(), e.setSelectionRange(e.value.length, e.value.length);
		}
	}, [a]);
	let O = (e) => {
		u(e), o(!1), t && t(e);
	};
	if (!r) return /* @__PURE__ */ z("div", {
		ref: x,
		tabIndex: 0,
		onKeyDown: (e) => {
			if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				let t = document.createRange();
				t.selectNodeContents(x.current);
				let n = window.getSelection();
				n.removeAllRanges(), n.addRange(t);
			}
		},
		className: "markdown-renderer flex flex-col gap-4 focus:outline-none",
		onCopy: (e) => {
			e.preventDefault(), e.clipboardData.setData("text/plain", E(T));
		},
		children: T.map((e) => /* @__PURE__ */ z(Bl, { block: e }, e.id))
	});
	if (a) return /* @__PURE__ */ z("textarea", {
		ref: S,
		value: s,
		onChange: (e) => c(e.target.value),
		onBlur: (e) => O(e.target.value),
		onKeyDown: (t) => {
			t.key === "Escape" && (t.preventDefault(), O(e));
		},
		className: "w-full min-h-[60vh] resize-none bg-transparent\r\n                   text-zinc-300 leading-relaxed\r\n                   focus:outline-none border-none",
		style: {
			fontFamily: "inherit",
			fontSize: "inherit"
		}
	});
	let k = (e) => {
		u(e), t && t(e);
	}, ee = async (e) => {
		let t = e.target.files?.[0];
		e.target.value = "", t && await A(t);
	}, A = async (e) => {
		if (!(!e || !i)) {
			m(!0);
			try {
				let t = await i(e);
				if (!t) return;
				let n = C.current, r = `\n![${e.name}](${t})\n`;
				if (!n) {
					k(`${l}${r}`);
					return;
				}
				let a = n.selectionStart ?? n.value.length, o = n.selectionEnd ?? n.value.length;
				k(`${l.slice(0, a)}${r}${l.slice(o)}`), requestAnimationFrame(() => {
					n.focus();
					let e = a + r.length;
					n.setSelectionRange(e, e);
				});
			} finally {
				m(!1);
			}
		}
	};
	return /* @__PURE__ */ B("div", {
		className: `relative flex gap-6 ${v ? "ring-1 ring-white/40" : ""}`,
		style: { minHeight: "60vh" },
		onDragEnter: (e) => {
			e.preventDefault(), e.stopPropagation(), b.current += 1, e.dataTransfer?.types?.includes("Files") && y(!0);
		},
		onDragOver: (e) => {
			e.preventDefault(), e.stopPropagation(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
		},
		onDragLeave: (e) => {
			e.preventDefault(), e.stopPropagation(), b.current = Math.max(0, b.current - 1), b.current === 0 && y(!1);
		},
		onDrop: async (e) => {
			e.preventDefault(), e.stopPropagation(), b.current = 0, y(!1);
			let t = Array.from(e.dataTransfer?.files || []).find((e) => e.type.startsWith("image/"));
			t && await A(t);
		},
		children: [
			v ? /* @__PURE__ */ z("div", {
				className: "pointer-events-none absolute inset-0 z-20 flex items-center justify-center border border-dashed border-white/30 bg-black/70 text-sm font-mono uppercase tracking-[0.28em] text-white",
				children: "drop image to upload"
			}) : null,
			/* @__PURE__ */ B("div", {
				className: "flex-1 min-w-0 border-r border-zinc-800 pr-6",
				children: [/* @__PURE__ */ z("div", {
					className: "text-xs text-zinc-600 uppercase tracking-wider mb-4",
					children: "Preview"
				}), /* @__PURE__ */ z("div", {
					className: "flex flex-col gap-4",
					onCopy: (e) => {
						e.preventDefault(), e.clipboardData.setData("text/plain", l);
					},
					children: T.map((e) => /* @__PURE__ */ z(Bl, { block: e }, e.id))
				})]
			}),
			/* @__PURE__ */ z("div", {
				className: "flex-1 min-w-0 pl-6",
				children: /* @__PURE__ */ B("div", {
					className: "sticky top-0 z-10 bg-black pb-4",
					children: [/* @__PURE__ */ B("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ z("div", {
							className: "text-xs text-zinc-600 uppercase tracking-wider",
							children: "Editor"
						}), /* @__PURE__ */ B("label", {
							className: "cursor-pointer border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white",
							children: [d ? "uploading..." : "insert image", /* @__PURE__ */ z("input", {
								type: "file",
								accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
								className: "hidden",
								onChange: ee,
								disabled: d
							})]
						})]
					}), /* @__PURE__ */ z("textarea", {
						ref: C,
						value: l,
						onChange: (e) => k(e.target.value),
						className: "w-full resize-none bg-transparent\n                       text-zinc-300 leading-relaxed font-mono text-sm\r\n                       focus:outline-none border-none",
						style: {
							fontFamily: "inherit",
							height: "calc(100vh - 4rem)"
						},
						placeholder: "Write your markdown here..."
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/components/BlogPost.jsx
function Hl(e) {
	let t = new Date(e);
	return `${t.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	})} ${t.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: !1
	})}`.toUpperCase();
}
function Ul(e) {
	let t = e?.publisher_name?.trim() || e?.author?.name?.trim();
	return t ? `by ${t}` : "by unknown";
}
function Wl({ post: e, isEditing: t, editRef: n, onBack: r, onUploadImage: i }) {
	let [a, o] = _(e.title), [s, c] = _(e.cover_image || ""), [l, u] = _((e.tags || []).join(", ")), [d, f] = _(!1), [h, v] = _(!1), y = g(null), b = g(null), x = g(0);
	m(() => {
		let e = b.current;
		e && (e.style.height = "auto", e.style.height = e.scrollHeight + "px");
	}, [a, t]), p(() => {
		n && (n.current = {
			getContent: () => y.current?.getContent() ?? e.content,
			getTitle: () => a,
			getCoverImage: () => s.trim(),
			getTags: () => l.split(",").map((e) => e.trim()).filter(Boolean)
		});
	}, [
		n,
		e.content,
		a,
		s,
		l
	]);
	let S = async (e) => {
		if (!(!e || !i)) {
			f(!0);
			try {
				let t = await i(e);
				t && c(t);
			} finally {
				f(!1);
			}
		}
	};
	return /* @__PURE__ */ B("div", {
		className: "article-sheet fixed inset-0 z-50 bg-black overflow-y-auto",
		children: [!t && e.cover_image ? /* @__PURE__ */ B("div", {
			className: "relative h-[38vh] min-h-[260px] w-full overflow-hidden border-b border-zinc-800",
			children: [/* @__PURE__ */ z("img", {
				src: e.cover_image,
				alt: e.title,
				className: "absolute inset-0 h-full w-full object-cover"
			}), /* @__PURE__ */ z("div", { className: "absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/90" })]
		}) : null, /* @__PURE__ */ B("div", {
			className: "article-reader px-[10%] py-16",
			children: [
				/* @__PURE__ */ z("button", {
					onClick: r,
					className: "article-reader__back text-lg font-mono text-white hover:text-white transition-colors mb-16",
					children: "back."
				}),
				/* @__PURE__ */ B("div", {
					className: "article-reader__meta ml-10 flex flex-wrap items-center gap-x-4 gap-y-2",
					children: [/* @__PURE__ */ z("time", {
						className: "font-mono text-sm tracking-widest text-zinc-500 uppercase",
						children: Hl(e.created_at)
					}), /* @__PURE__ */ z("div", {
						className: "text-xs font-mono tracking-[0.28em] text-zinc-600 uppercase",
						children: Ul(e)
					})]
				}),
				t ? /* @__PURE__ */ B("div", {
					className: `relative mt-6 border ${h ? "border-white/40" : "border-transparent"}`,
					onDragEnter: (e) => {
						e.preventDefault(), e.stopPropagation(), x.current += 1, e.dataTransfer?.types?.includes("Files") && v(!0);
					},
					onDragOver: (e) => {
						e.preventDefault(), e.stopPropagation(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
					},
					onDragLeave: (e) => {
						e.preventDefault(), e.stopPropagation(), x.current = Math.max(0, x.current - 1), x.current === 0 && v(!1);
					},
					onDrop: async (e) => {
						e.preventDefault(), e.stopPropagation(), x.current = 0, v(!1);
						let t = Array.from(e.dataTransfer?.files || []).find((e) => e.type.startsWith("image/"));
						t && await S(t);
					},
					children: [h ? /* @__PURE__ */ z("div", {
						className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center border border-dashed border-white/30 bg-black/70 text-xs font-mono uppercase tracking-[0.28em] text-white",
						children: "drop cover image here"
					}) : null, /* @__PURE__ */ B("div", {
						className: "flex flex-col gap-3 md:flex-row",
						children: [/* @__PURE__ */ z("input", {
							value: s,
							onChange: (e) => c(e.target.value),
							className: "w-full bg-white/5 px-3 py-3 text-sm text-zinc-300 border border-zinc-800 focus:border-zinc-600 focus:outline-none placeholder:text-zinc-600",
							placeholder: "Cover image URL..."
						}), /* @__PURE__ */ B("label", {
							className: "cursor-pointer border border-zinc-800 px-4 py-3 text-xs font-mono uppercase tracking-[0.24em] text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white",
							children: [d ? "uploading..." : "upload cover", /* @__PURE__ */ z("input", {
								type: "file",
								accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp",
								className: "hidden",
								onChange: async (e) => {
									let t = e.target.files?.[0];
									e.target.value = "", t && await S(t);
								},
								disabled: d
							})]
						})]
					})]
				}) : null,
				t ? /* @__PURE__ */ z("textarea", {
					ref: b,
					value: a,
					onChange: (e) => o(e.target.value),
					rows: 1,
					className: "article-reader__title mt-4 w-full text-3xl font-bold tracking-tight text-white sm:text-4xl\n                       bg-transparent border-none focus:outline-none resize-none\r\n                       overflow-hidden placeholder:text-zinc-600",
					placeholder: "Article title..."
				}) : /* @__PURE__ */ z("h1", {
					className: "article-reader__title mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl",
					children: e.title
				}),
				t ? /* @__PURE__ */ z("div", {
					className: "mt-6",
					children: /* @__PURE__ */ z("input", {
						value: l,
						onChange: (e) => u(e.target.value),
						className: "w-full bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-400\r\n                         border border-zinc-800 focus:border-zinc-600 focus:outline-none\r\n                         placeholder:text-zinc-600",
						placeholder: "tag1, tag2, tag3..."
					})
				}) : e.tags && e.tags.length > 0 && /* @__PURE__ */ z("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: e.tags.map((e) => /* @__PURE__ */ z("span", {
						className: "bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-500 border border-zinc-800",
						children: e
					}, e))
				}),
				/* @__PURE__ */ z("div", { className: "article-reader__rule mt-10 border-t border-zinc-800" }),
				/* @__PURE__ */ z("div", {
					className: "article-reader__body mt-10",
					children: /* @__PURE__ */ z(Vl, {
						value: e.content,
						editing: t,
						editorRef: y,
						onUploadImage: i
					})
				}),
				/* @__PURE__ */ z("div", {
					className: "mt-20 border-t border-zinc-800 pt-8",
					children: /* @__PURE__ */ z("button", {
						onClick: r,
						className: "text-lg font-mono text-white hover:text-white transition-colors",
						children: "back."
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/ConstructionNotice.jsx
function Gl() {
	return /* @__PURE__ */ z("aside", {
		className: "construction-notice",
		role: "status",
		"aria-label": "施工中：此页面正在建设。",
		children: /* @__PURE__ */ B("div", {
			className: "construction-notice__band",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ z("span", { className: "construction-notice__clearance" }), /* @__PURE__ */ z("strong", { children: "施工中" })]
		})
	});
}
//#endregion
//#region src/components/AppDrawer.jsx
function Kl({ user: e, label: t, items: n = [], onOpenSignIn: r, placement: i = "page" }) {
	let [a, o] = _(!1), s = `app-drawer app-drawer--${i}`;
	return e ? /* @__PURE__ */ B("div", {
		className: s,
		children: [a && /* @__PURE__ */ z("div", {
			className: "drawer-menu",
			children: n.map((e) => /* @__PURE__ */ z("button", {
				className: "drawer-item",
				type: "button",
				onClick: () => {
					o(!1), e.onClick?.();
				},
				children: e.label
			}, e.label))
		}), /* @__PURE__ */ z("button", {
			className: "drawer-toggle",
			type: "button",
			"aria-expanded": a,
			onClick: () => o((e) => !e),
			children: t
		})]
	}) : /* @__PURE__ */ z("div", {
		className: s,
		children: /* @__PURE__ */ z("button", {
			className: "drawer-toggle",
			type: "button",
			onClick: r,
			children: "log-in."
		})
	});
}
//#endregion
//#region src/physics/PhysicsItem.jsx
function ql({ children: e, className: t = "", strength: n = 1 }) {
	return /* @__PURE__ */ z("div", {
		className: t,
		"data-physics-item": "true",
		"data-physics-strength": n,
		children: e
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/bind.js
function Jl(e, t) {
	return function() {
		return e.apply(t, arguments);
	};
}
//#endregion
//#region node_modules/axios/lib/utils.js
var { toString: Yl } = Object.prototype, { getPrototypeOf: Xl } = Object, { iterator: Zl, toStringTag: Ql } = Symbol, $l = ((e) => (t) => {
	let n = Yl.call(t);
	return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(Object.create(null)), eu = (e) => (e = e.toLowerCase(), (t) => $l(t) === e), tu = (e) => (t) => typeof t === e, { isArray: nu } = Array, ru = tu("undefined");
function iu(e) {
	return e !== null && !ru(e) && e.constructor !== null && !ru(e.constructor) && J(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
var au = eu("ArrayBuffer");
function ou(e) {
	let t;
	return t = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && au(e.buffer), t;
}
var su = tu("string"), J = tu("function"), cu = tu("number"), lu = (e) => typeof e == "object" && !!e, uu = (e) => e === !0 || e === !1, du = (e) => {
	if ($l(e) !== "object") return !1;
	let t = Xl(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Ql in e) && !(Zl in e);
}, fu = (e) => {
	if (!lu(e) || iu(e)) return !1;
	try {
		return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
	} catch {
		return !1;
	}
}, pu = eu("Date"), mu = eu("File"), hu = (e) => !!(e && e.uri !== void 0), gu = (e) => e && e.getParts !== void 0, _u = eu("Blob"), vu = eu("FileList"), yu = (e) => lu(e) && J(e.pipe);
function bu() {
	return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
var xu = bu(), Su = xu.FormData === void 0 ? void 0 : xu.FormData, Cu = (e) => {
	if (!e) return !1;
	if (Su && e instanceof Su) return !0;
	let t = Xl(e);
	if (!t || t === Object.prototype || !J(e.append)) return !1;
	let n = $l(e);
	return n === "formdata" || n === "object" && J(e.toString) && e.toString() === "[object FormData]";
}, wu = eu("URLSearchParams"), [Tu, Eu, Du, Ou] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(eu), ku = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Au(e, t, { allOwnKeys: n = !1 } = {}) {
	if (e == null) return;
	let r, i;
	if (typeof e != "object" && (e = [e]), nu(e)) for (r = 0, i = e.length; r < i; r++) t.call(null, e[r], r, e);
	else {
		if (iu(e)) return;
		let i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length, o;
		for (r = 0; r < a; r++) o = i[r], t.call(null, e[o], o, e);
	}
}
function ju(e, t) {
	if (iu(e)) return null;
	t = t.toLowerCase();
	let n = Object.keys(e), r = n.length, i;
	for (; r-- > 0;) if (i = n[r], t === i.toLowerCase()) return i;
	return null;
}
var Mu = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Nu = (e) => !ru(e) && e !== Mu;
function Pu(...e) {
	let { caseless: t, skipUndefined: n } = Nu(this) && this || {}, r = {}, i = (e, i) => {
		if (i === "__proto__" || i === "constructor" || i === "prototype") return;
		let a = t && ju(r, i) || i, o = Ku(r, a) ? r[a] : void 0;
		du(o) && du(e) ? r[a] = Pu(o, e) : du(e) ? r[a] = Pu({}, e) : nu(e) ? r[a] = e.slice() : (!n || !ru(e)) && (r[a] = e);
	};
	for (let t = 0, n = e.length; t < n; t++) e[t] && Au(e[t], i);
	return r;
}
var Fu = (e, t, n, { allOwnKeys: r } = {}) => (Au(t, (t, r) => {
	n && J(t) ? Object.defineProperty(e, r, {
		__proto__: null,
		value: Jl(t, n),
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
}, { allOwnKeys: r }), e), Iu = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Lu = (e, t, n, r) => {
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
}, Ru = (e, t, n, r) => {
	let i, a, o, s = {};
	if (t ||= {}, e == null) return t;
	do {
		for (i = Object.getOwnPropertyNames(e), a = i.length; a-- > 0;) o = i[a], (!r || r(o, e, t)) && !s[o] && (t[o] = e[o], s[o] = !0);
		e = n !== !1 && Xl(e);
	} while (e && (!n || n(e, t)) && e !== Object.prototype);
	return t;
}, zu = (e, t, n) => {
	e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
	let r = e.indexOf(t, n);
	return r !== -1 && r === n;
}, Bu = (e) => {
	if (!e) return null;
	if (nu(e)) return e;
	let t = e.length;
	if (!cu(t)) return null;
	let n = Array(t);
	for (; t-- > 0;) n[t] = e[t];
	return n;
}, Vu = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && Xl(Uint8Array)), Hu = (e, t) => {
	let n = (e && e[Zl]).call(e), r;
	for (; (r = n.next()) && !r.done;) {
		let n = r.value;
		t.call(e, n[0], n[1]);
	}
}, Uu = (e, t) => {
	let n, r = [];
	for (; (n = e.exec(t)) !== null;) r.push(n);
	return r;
}, Wu = eu("HTMLFormElement"), Gu = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(e, t, n) {
	return t.toUpperCase() + n;
}), Ku = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), qu = eu("RegExp"), Ju = (e, t) => {
	let n = Object.getOwnPropertyDescriptors(e), r = {};
	Au(n, (n, i) => {
		let a;
		(a = t(n, i, e)) !== !1 && (r[i] = a || n);
	}), Object.defineProperties(e, r);
}, Yu = (e) => {
	Ju(e, (t, n) => {
		if (J(e) && [
			"arguments",
			"caller",
			"callee"
		].includes(n)) return !1;
		let r = e[n];
		if (J(r)) {
			if (t.enumerable = !1, "writable" in t) {
				t.writable = !1;
				return;
			}
			t.set ||= () => {
				throw Error("Can not rewrite read-only method '" + n + "'");
			};
		}
	});
}, Xu = (e, t) => {
	let n = {}, r = (e) => {
		e.forEach((e) => {
			n[e] = !0;
		});
	};
	return nu(e) ? r(e) : r(String(e).split(t)), n;
}, Zu = () => {}, Qu = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function $u(e) {
	return !!(e && J(e.append) && e[Ql] === "FormData" && e[Zl]);
}
var ed = (e) => {
	let t = /* @__PURE__ */ new WeakSet(), n = (e) => {
		if (lu(e)) {
			if (t.has(e)) return;
			if (iu(e)) return e;
			if (!("toJSON" in e)) {
				t.add(e);
				let r = nu(e) ? [] : {};
				return Au(e, (e, t) => {
					let i = n(e);
					!ru(i) && (r[t] = i);
				}), t.delete(e), r;
			}
		}
		return e;
	};
	return n(e);
}, td = eu("AsyncFunction"), nd = (e) => e && (lu(e) || J(e)) && J(e.then) && J(e.catch), rd = ((e, t) => e ? setImmediate : t ? ((e, t) => (Mu.addEventListener("message", ({ source: n, data: r }) => {
	n === Mu && r === e && t.length && t.shift()();
}, !1), (n) => {
	t.push(n), Mu.postMessage(e, "*");
}))(`axios@${Math.random()}`, []) : (e) => setTimeout(e))(typeof setImmediate == "function", J(Mu.postMessage)), Y = {
	isArray: nu,
	isArrayBuffer: au,
	isBuffer: iu,
	isFormData: Cu,
	isArrayBufferView: ou,
	isString: su,
	isNumber: cu,
	isBoolean: uu,
	isObject: lu,
	isPlainObject: du,
	isEmptyObject: fu,
	isReadableStream: Tu,
	isRequest: Eu,
	isResponse: Du,
	isHeaders: Ou,
	isUndefined: ru,
	isDate: pu,
	isFile: mu,
	isReactNativeBlob: hu,
	isReactNative: gu,
	isBlob: _u,
	isRegExp: qu,
	isFunction: J,
	isStream: yu,
	isURLSearchParams: wu,
	isTypedArray: Vu,
	isFileList: vu,
	forEach: Au,
	merge: Pu,
	extend: Fu,
	trim: ku,
	stripBOM: Iu,
	inherits: Lu,
	toFlatObject: Ru,
	kindOf: $l,
	kindOfTest: eu,
	endsWith: zu,
	toArray: Bu,
	forEachEntry: Hu,
	matchAll: Uu,
	isHTMLForm: Wu,
	hasOwnProperty: Ku,
	hasOwnProp: Ku,
	reduceDescriptors: Ju,
	freezeMethods: Yu,
	toObjectSet: Xu,
	toCamelCase: Gu,
	noop: Zu,
	toFiniteNumber: Qu,
	findKey: ju,
	global: Mu,
	isContextDefined: Nu,
	isSpecCompliantForm: $u,
	toJSONObject: ed,
	isAsyncFn: td,
	isThenable: nd,
	setImmediate: rd,
	asap: typeof queueMicrotask < "u" ? queueMicrotask.bind(Mu) : typeof process < "u" && process.nextTick || rd,
	isIterable: (e) => e != null && J(e[Zl])
}, id = Y.toObjectSet([
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
]), ad = (e) => {
	let t = {}, n, r, i;
	return e && e.split("\n").forEach(function(e) {
		i = e.indexOf(":"), n = e.substring(0, i).trim().toLowerCase(), r = e.substring(i + 1).trim(), !(!n || t[n] && id[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
	}), t;
};
//#endregion
//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
function od(e) {
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
var sd = /* @__PURE__ */ RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), cd = /* @__PURE__ */ RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function ld(e, t) {
	return Y.isArray(e) ? e.map((e) => ld(e, t)) : od(String(e).replace(t, ""));
}
var ud = (e) => ld(e, sd), dd = (e) => ld(e, cd);
function fd(e) {
	let t = Object.create(null);
	return Y.forEach(e.toJSON(), (e, n) => {
		t[n] = dd(e);
	}), t;
}
//#endregion
//#region node_modules/axios/lib/core/AxiosHeaders.js
var pd = Symbol("internals");
function md(e) {
	return e && String(e).trim().toLowerCase();
}
function hd(e) {
	return e === !1 || e == null ? e : Y.isArray(e) ? e.map(hd) : ud(String(e));
}
function gd(e) {
	let t = Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g, r;
	for (; r = n.exec(e);) t[r[1]] = r[2];
	return t;
}
var _d = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function vd(e, t, n, r, i) {
	if (Y.isFunction(r)) return r.call(this, t, n);
	if (i && (t = n), Y.isString(t)) {
		if (Y.isString(r)) return t.indexOf(r) !== -1;
		if (Y.isRegExp(r)) return r.test(t);
	}
}
function yd(e) {
	return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
}
function bd(e, t) {
	let n = Y.toCamelCase(" " + t);
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
var X = class {
	constructor(e) {
		e && this.set(e);
	}
	set(e, t, n) {
		let r = this;
		function i(e, t, n) {
			let i = md(t);
			if (!i) throw Error("header name must be a non-empty string");
			let a = Y.findKey(r, i);
			(!a || r[a] === void 0 || n === !0 || n === void 0 && r[a] !== !1) && (r[a || t] = hd(e));
		}
		let a = (e, t) => Y.forEach(e, (e, n) => i(e, n, t));
		if (Y.isPlainObject(e) || e instanceof this.constructor) a(e, t);
		else if (Y.isString(e) && (e = e.trim()) && !_d(e)) a(ad(e), t);
		else if (Y.isObject(e) && Y.isIterable(e)) {
			let n = {}, r, i;
			for (let t of e) {
				if (!Y.isArray(t)) throw TypeError("Object iterator must return a key-value pair");
				n[i = t[0]] = (r = n[i]) ? Y.isArray(r) ? [...r, t[1]] : [r, t[1]] : t[1];
			}
			a(n, t);
		} else e != null && i(t, e, n);
		return this;
	}
	get(e, t) {
		if (e = md(e), e) {
			let n = Y.findKey(this, e);
			if (n) {
				let e = this[n];
				if (!t) return e;
				if (t === !0) return gd(e);
				if (Y.isFunction(t)) return t.call(this, e, n);
				if (Y.isRegExp(t)) return t.exec(e);
				throw TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(e, t) {
		if (e = md(e), e) {
			let n = Y.findKey(this, e);
			return !!(n && this[n] !== void 0 && (!t || vd(this, this[n], n, t)));
		}
		return !1;
	}
	delete(e, t) {
		let n = this, r = !1;
		function i(e) {
			if (e = md(e), e) {
				let i = Y.findKey(n, e);
				i && (!t || vd(n, n[i], i, t)) && (delete n[i], r = !0);
			}
		}
		return Y.isArray(e) ? e.forEach(i) : i(e), r;
	}
	clear(e) {
		let t = Object.keys(this), n = t.length, r = !1;
		for (; n--;) {
			let i = t[n];
			(!e || vd(this, this[i], i, e, !0)) && (delete this[i], r = !0);
		}
		return r;
	}
	normalize(e) {
		let t = this, n = {};
		return Y.forEach(this, (r, i) => {
			let a = Y.findKey(n, i);
			if (a) {
				t[a] = hd(r), delete t[i];
				return;
			}
			let o = e ? yd(i) : String(i).trim();
			o !== i && delete t[i], t[o] = hd(r), n[o] = !0;
		}), this;
	}
	concat(...e) {
		return this.constructor.concat(this, ...e);
	}
	toJSON(e) {
		let t = Object.create(null);
		return Y.forEach(this, (n, r) => {
			n != null && n !== !1 && (t[r] = e && Y.isArray(n) ? n.join(", ") : n);
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
		let t = (this[pd] = this[pd] = { accessors: {} }).accessors, n = this.prototype;
		function r(e) {
			let r = md(e);
			t[r] || (bd(n, e), t[r] = !0);
		}
		return Y.isArray(e) ? e.forEach(r) : r(e), this;
	}
};
X.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]), Y.reduceDescriptors(X.prototype, ({ value: e }, t) => {
	let n = t[0].toUpperCase() + t.slice(1);
	return {
		get: () => e,
		set(e) {
			this[n] = e;
		}
	};
}), Y.freezeMethods(X);
//#endregion
//#region node_modules/axios/lib/core/AxiosError.js
var xd = "[REDACTED ****]";
function Sd(e) {
	if (Y.hasOwnProp(e, "toJSON")) return !0;
	let t = Object.getPrototypeOf(e);
	for (; t && t !== Object.prototype;) {
		if (Y.hasOwnProp(t, "toJSON")) return !0;
		t = Object.getPrototypeOf(t);
	}
	return !1;
}
function Cd(e, t) {
	let n = new Set(t.map((e) => String(e).toLowerCase())), r = [], i = (e) => {
		if (typeof e != "object" || !e || Y.isBuffer(e)) return e;
		if (r.indexOf(e) !== -1) return;
		e instanceof X && (e = e.toJSON()), r.push(e);
		let t;
		if (Y.isArray(e)) t = [], e.forEach((e, n) => {
			let r = i(e);
			Y.isUndefined(r) || (t[n] = r);
		});
		else {
			if (!Y.isPlainObject(e) && Sd(e)) return r.pop(), e;
			t = Object.create(null);
			for (let [r, a] of Object.entries(e)) {
				let e = n.has(r.toLowerCase()) ? xd : i(a);
				Y.isUndefined(e) || (t[r] = e);
			}
		}
		return r.pop(), t;
	};
	return i(e);
}
var Z = class e extends Error {
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
		let e = this.config, t = e && Y.hasOwnProp(e, "redact") ? e.redact : void 0, n = Y.isArray(t) && t.length > 0 ? Cd(e, t) : Y.toJSONObject(e);
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
Z.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE", Z.ERR_BAD_OPTION = "ERR_BAD_OPTION", Z.ECONNABORTED = "ECONNABORTED", Z.ETIMEDOUT = "ETIMEDOUT", Z.ECONNREFUSED = "ECONNREFUSED", Z.ERR_NETWORK = "ERR_NETWORK", Z.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS", Z.ERR_DEPRECATED = "ERR_DEPRECATED", Z.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE", Z.ERR_BAD_REQUEST = "ERR_BAD_REQUEST", Z.ERR_CANCELED = "ERR_CANCELED", Z.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT", Z.ERR_INVALID_URL = "ERR_INVALID_URL", Z.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
//#endregion
//#region node_modules/axios/lib/helpers/toFormData.js
function wd(e) {
	return Y.isPlainObject(e) || Y.isArray(e);
}
function Td(e) {
	return Y.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Ed(e, t, n) {
	return e ? e.concat(t).map(function(e, t) {
		return e = Td(e), !n && t ? "[" + e + "]" : e;
	}).join(n ? "." : "") : t;
}
function Dd(e) {
	return Y.isArray(e) && !e.some(wd);
}
var Od = Y.toFlatObject(Y, {}, null, function(e) {
	return /^is[A-Z]/.test(e);
});
function kd(e, t, n) {
	if (!Y.isObject(e)) throw TypeError("target must be an object");
	t ||= new FormData(), n = Y.toFlatObject(n, {
		metaTokens: !0,
		dots: !1,
		indexes: !1
	}, !1, function(e, t) {
		return !Y.isUndefined(t[e]);
	});
	let r = n.metaTokens, i = n.visitor || d, a = n.dots, o = n.indexes, s = n.Blob || typeof Blob < "u" && Blob, c = n.maxDepth === void 0 ? 100 : n.maxDepth, l = s && Y.isSpecCompliantForm(t);
	if (!Y.isFunction(i)) throw TypeError("visitor must be a function");
	function u(e) {
		if (e === null) return "";
		if (Y.isDate(e)) return e.toISOString();
		if (Y.isBoolean(e)) return e.toString();
		if (!l && Y.isBlob(e)) throw new Z("Blob is not supported. Use a Buffer instead.");
		return Y.isArrayBuffer(e) || Y.isTypedArray(e) ? l && typeof Blob == "function" ? new Blob([e]) : Buffer.from(e) : e;
	}
	function d(e, n, i) {
		let s = e;
		if (Y.isReactNative(t) && Y.isReactNativeBlob(e)) return t.append(Ed(i, n, a), u(e)), !1;
		if (e && !i && typeof e == "object") {
			if (Y.endsWith(n, "{}")) n = r ? n : n.slice(0, -2), e = JSON.stringify(e);
			else if (Y.isArray(e) && Dd(e) || (Y.isFileList(e) || Y.endsWith(n, "[]")) && (s = Y.toArray(e))) return n = Td(n), s.forEach(function(e, r) {
				!(Y.isUndefined(e) || e === null) && t.append(o === !0 ? Ed([n], r, a) : o === null ? n : n + "[]", u(e));
			}), !1;
		}
		return wd(e) ? !0 : (t.append(Ed(i, n, a), u(e)), !1);
	}
	let f = [], p = Object.assign(Od, {
		defaultVisitor: d,
		convertValue: u,
		isVisitable: wd
	});
	function m(e, n, r = 0) {
		if (!Y.isUndefined(e)) {
			if (r > c) throw new Z("Object is too deeply nested (" + r + " levels). Max depth: " + c, Z.ERR_FORM_DATA_DEPTH_EXCEEDED);
			if (f.indexOf(e) !== -1) throw Error("Circular reference detected in " + n.join("."));
			f.push(e), Y.forEach(e, function(e, a) {
				(!(Y.isUndefined(e) || e === null) && i.call(t, e, Y.isString(a) ? a.trim() : a, n, p)) === !0 && m(e, n ? n.concat(a) : [a], r + 1);
			}), f.pop();
		}
	}
	if (!Y.isObject(e)) throw TypeError("data must be an object");
	return m(e), t;
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function Ad(e) {
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
function jd(e, t) {
	this._pairs = [], e && kd(e, this, t);
}
var Md = jd.prototype;
Md.append = function(e, t) {
	this._pairs.push([e, t]);
}, Md.toString = function(e) {
	let t = e ? function(t) {
		return e.call(this, t, Ad);
	} : Ad;
	return this._pairs.map(function(e) {
		return t(e[0]) + "=" + t(e[1]);
	}, "").join("&");
};
//#endregion
//#region node_modules/axios/lib/helpers/buildURL.js
function Nd(e) {
	return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function Pd(e, t, n) {
	if (!t) return e;
	let r = n && n.encode || Nd, i = Y.isFunction(n) ? { serialize: n } : n, a = i && i.serialize, o;
	if (o = a ? a(t, i) : Y.isURLSearchParams(t) ? t.toString() : new jd(t, i).toString(r), o) {
		let t = e.indexOf("#");
		t !== -1 && (e = e.slice(0, t)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
	}
	return e;
}
//#endregion
//#region node_modules/axios/lib/core/InterceptorManager.js
var Fd = class {
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
		Y.forEach(this.handlers, function(t) {
			t !== null && e(t);
		});
	}
}, Id = {
	silentJSONParsing: !0,
	forcedJSONParsing: !0,
	clarifyTimeoutError: !1,
	legacyInterceptorReqResOrdering: !0
}, Ld = {
	isBrowser: !0,
	classes: {
		URLSearchParams: typeof URLSearchParams < "u" ? URLSearchParams : jd,
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
}, Rd = /* @__PURE__ */ s({
	hasBrowserEnv: () => zd,
	hasStandardBrowserEnv: () => Vd,
	hasStandardBrowserWebWorkerEnv: () => Hd,
	navigator: () => Bd,
	origin: () => Ud
}), zd = typeof window < "u" && typeof document < "u", Bd = typeof navigator == "object" && navigator || void 0, Vd = zd && (!Bd || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(Bd.product) < 0), Hd = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Ud = zd && window.location.href || "http://localhost", Q = {
	...Rd,
	...Ld
};
//#endregion
//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
function Wd(e, t) {
	return kd(e, new Q.classes.URLSearchParams(), {
		visitor: function(e, t, n, r) {
			return Q.isNode && Y.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : r.defaultVisitor.apply(this, arguments);
		},
		...t
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/formDataToJSON.js
function Gd(e) {
	return Y.matchAll(/\w+|\[(\w*)]/g, e).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function Kd(e) {
	let t = {}, n = Object.keys(e), r, i = n.length, a;
	for (r = 0; r < i; r++) a = n[r], t[a] = e[a];
	return t;
}
function qd(e) {
	function t(e, n, r, i) {
		let a = e[i++];
		if (a === "__proto__") return !0;
		let o = Number.isFinite(+a), s = i >= e.length;
		return a = !a && Y.isArray(r) ? r.length : a, s ? (Y.hasOwnProp(r, a) ? r[a] = Y.isArray(r[a]) ? r[a].concat(n) : [r[a], n] : r[a] = n, !o) : ((!Y.hasOwnProp(r, a) || !Y.isObject(r[a])) && (r[a] = []), t(e, n, r[a], i) && Y.isArray(r[a]) && (r[a] = Kd(r[a])), !o);
	}
	if (Y.isFormData(e) && Y.isFunction(e.entries)) {
		let n = {};
		return Y.forEachEntry(e, (e, r) => {
			t(Gd(e), r, n, 0);
		}), n;
	}
	return null;
}
//#endregion
//#region node_modules/axios/lib/defaults/index.js
var Jd = (e, t) => e != null && Y.hasOwnProp(e, t) ? e[t] : void 0;
function Yd(e, t, n) {
	if (Y.isString(e)) try {
		return (t || JSON.parse)(e), Y.trim(e);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (n || JSON.stringify)(e);
}
var Xd = {
	transitional: Id,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function(e, t) {
		let n = t.getContentType() || "", r = n.indexOf("application/json") > -1, i = Y.isObject(e);
		if (i && Y.isHTMLForm(e) && (e = new FormData(e)), Y.isFormData(e)) return r ? JSON.stringify(qd(e)) : e;
		if (Y.isArrayBuffer(e) || Y.isBuffer(e) || Y.isStream(e) || Y.isFile(e) || Y.isBlob(e) || Y.isReadableStream(e)) return e;
		if (Y.isArrayBufferView(e)) return e.buffer;
		if (Y.isURLSearchParams(e)) return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
		let a;
		if (i) {
			let t = Jd(this, "formSerializer");
			if (n.indexOf("application/x-www-form-urlencoded") > -1) return Wd(e, t).toString();
			if ((a = Y.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
				let n = Jd(this, "env"), r = n && n.FormData;
				return kd(a ? { "files[]": e } : e, r && new r(), t);
			}
		}
		return i || r ? (t.setContentType("application/json", !1), Yd(e)) : e;
	}],
	transformResponse: [function(e) {
		let t = Jd(this, "transitional") || Xd.transitional, n = t && t.forcedJSONParsing, r = Jd(this, "responseType"), i = r === "json";
		if (Y.isResponse(e) || Y.isReadableStream(e)) return e;
		if (e && Y.isString(e) && (n && !r || i)) {
			let n = !(t && t.silentJSONParsing) && i;
			try {
				return JSON.parse(e, Jd(this, "parseReviver"));
			} catch (e) {
				if (n) throw e.name === "SyntaxError" ? Z.from(e, Z.ERR_BAD_RESPONSE, this, null, Jd(this, "response")) : e;
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
		FormData: Q.classes.FormData,
		Blob: Q.classes.Blob
	},
	validateStatus: function(e) {
		return e >= 200 && e < 300;
	},
	headers: { common: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
Y.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch",
	"query"
], (e) => {
	Xd.headers[e] = {};
});
//#endregion
//#region node_modules/axios/lib/core/transformData.js
function Zd(e, t) {
	let n = this || Xd, r = t || n, i = X.from(r.headers), a = r.data;
	return Y.forEach(e, function(e) {
		a = e.call(n, a, i.normalize(), t ? t.status : void 0);
	}), i.normalize(), a;
}
//#endregion
//#region node_modules/axios/lib/cancel/isCancel.js
function Qd(e) {
	return !!(e && e.__CANCEL__);
}
//#endregion
//#region node_modules/axios/lib/cancel/CanceledError.js
var $d = class extends Z {
	constructor(e, t, n) {
		super(e ?? "canceled", Z.ERR_CANCELED, t, n), this.name = "CanceledError", this.__CANCEL__ = !0;
	}
};
//#endregion
//#region node_modules/axios/lib/core/settle.js
function ef(e, t, n) {
	let r = n.config.validateStatus;
	!n.status || !r || r(n.status) ? e(n) : t(new Z("Request failed with status code " + n.status, n.status >= 400 && n.status < 500 ? Z.ERR_BAD_REQUEST : Z.ERR_BAD_RESPONSE, n.config, n.request, n));
}
//#endregion
//#region node_modules/axios/lib/helpers/parseProtocol.js
function tf(e) {
	let t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
	return t && t[1] || "";
}
//#endregion
//#region node_modules/axios/lib/helpers/speedometer.js
function nf(e, t) {
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
function rf(e, t) {
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
var af = (e, t, n = 3) => {
	let r = 0, i = nf(50, 250);
	return rf((n) => {
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
}, of = (e, t) => {
	let n = e != null;
	return [(r) => t[0]({
		lengthComputable: n,
		total: e,
		loaded: r
	}), t[1]];
}, sf = (e) => (...t) => Y.asap(() => e(...t)), cf = Q.hasStandardBrowserEnv ? ((e, t) => (n) => (n = new URL(n, Q.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(new URL(Q.origin), Q.navigator && /(msie|trident)/i.test(Q.navigator.userAgent)) : () => !0, lf = Q.hasStandardBrowserEnv ? {
	write(e, t, n, r, i, a, o) {
		if (typeof document > "u") return;
		let s = [`${e}=${encodeURIComponent(t)}`];
		Y.isNumber(n) && s.push(`expires=${new Date(n).toUTCString()}`), Y.isString(r) && s.push(`path=${r}`), Y.isString(i) && s.push(`domain=${i}`), a === !0 && s.push("secure"), Y.isString(o) && s.push(`SameSite=${o}`), document.cookie = s.join("; ");
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
function uf(e) {
	return typeof e == "string" ? /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e) : !1;
}
//#endregion
//#region node_modules/axios/lib/helpers/combineURLs.js
function df(e, t) {
	return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
//#endregion
//#region node_modules/axios/lib/core/buildFullPath.js
function ff(e, t, n) {
	let r = !uf(t);
	return e && (r || n === !1) ? df(e, t) : t;
}
//#endregion
//#region node_modules/axios/lib/core/mergeConfig.js
var pf = (e) => e instanceof X ? { ...e } : e;
function mf(e, t) {
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
		return Y.isPlainObject(e) && Y.isPlainObject(t) ? Y.merge.call({ caseless: r }, e, t) : Y.isPlainObject(t) ? Y.merge({}, t) : Y.isArray(t) ? t.slice() : t;
	}
	function i(e, t, n, i) {
		if (!Y.isUndefined(t)) return r(e, t, n, i);
		if (!Y.isUndefined(e)) return r(void 0, e, n, i);
	}
	function a(e, t) {
		if (!Y.isUndefined(t)) return r(void 0, t);
	}
	function o(e, t) {
		if (!Y.isUndefined(t)) return r(void 0, t);
		if (!Y.isUndefined(e)) return r(void 0, e);
	}
	function s(n, i, a) {
		if (Y.hasOwnProp(t, a)) return r(n, i);
		if (Y.hasOwnProp(e, a)) return r(void 0, n);
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
		headers: (e, t, n) => i(pf(e), pf(t), n, !0)
	};
	return Y.forEach(Object.keys({
		...e,
		...t
	}), function(r) {
		if (r === "__proto__" || r === "constructor" || r === "prototype") return;
		let a = Y.hasOwnProp(c, r) ? c[r] : i, o = a(Y.hasOwnProp(e, r) ? e[r] : void 0, Y.hasOwnProp(t, r) ? t[r] : void 0, r);
		Y.isUndefined(o) && a !== s || (n[r] = o);
	}), n;
}
//#endregion
//#region node_modules/axios/lib/helpers/resolveConfig.js
var hf = ["content-type", "content-length"];
function gf(e, t, n) {
	if (n !== "content-only") {
		e.set(t);
		return;
	}
	Object.entries(t).forEach(([t, n]) => {
		hf.includes(t.toLowerCase()) && e.set(t, n);
	});
}
var _f = (e) => encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (e, t) => String.fromCharCode(parseInt(t, 16))), vf = (e) => {
	let t = mf({}, e), n = (e) => Y.hasOwnProp(t, e) ? t[e] : void 0, r = n("data"), i = n("withXSRFToken"), a = n("xsrfHeaderName"), o = n("xsrfCookieName"), s = n("headers"), c = n("auth"), l = n("baseURL"), u = n("allowAbsoluteUrls"), d = n("url");
	if (t.headers = s = X.from(s), t.url = Pd(ff(l, d, u), e.params, e.paramsSerializer), c && s.set("Authorization", "Basic " + btoa((c.username || "") + ":" + (c.password ? _f(c.password) : ""))), Y.isFormData(r) && (Q.hasStandardBrowserEnv || Q.hasStandardBrowserWebWorkerEnv ? s.setContentType(void 0) : Y.isFunction(r.getHeaders) && gf(s, r.getHeaders(), n("formDataHeaderPolicy"))), Q.hasStandardBrowserEnv && (Y.isFunction(i) && (i = i(t)), i === !0 || i == null && cf(t.url))) {
		let e = a && o && lf.read(o);
		e && s.set(a, e);
	}
	return t;
}, yf = typeof XMLHttpRequest < "u" && function(e) {
	return new Promise(function(t, n) {
		let r = vf(e), i = r.data, a = X.from(r.headers).normalize(), { responseType: o, onUploadProgress: s, onDownloadProgress: c } = r, l, u, d, f, p;
		function m() {
			f && f(), p && p(), r.cancelToken && r.cancelToken.unsubscribe(l), r.signal && r.signal.removeEventListener("abort", l);
		}
		let h = new XMLHttpRequest();
		h.open(r.method.toUpperCase(), r.url, !0), h.timeout = r.timeout;
		function g() {
			if (!h) return;
			let r = X.from("getAllResponseHeaders" in h && h.getAllResponseHeaders());
			ef(function(e) {
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
			h &&= (n(new Z("Request aborted", Z.ECONNABORTED, e, h)), m(), null);
		}, h.onerror = function(t) {
			let r = new Z(t && t.message ? t.message : "Network Error", Z.ERR_NETWORK, e, h);
			r.event = t || null, n(r), m(), h = null;
		}, h.ontimeout = function() {
			let t = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded", i = r.transitional || Id;
			r.timeoutErrorMessage && (t = r.timeoutErrorMessage), n(new Z(t, i.clarifyTimeoutError ? Z.ETIMEDOUT : Z.ECONNABORTED, e, h)), m(), h = null;
		}, i === void 0 && a.setContentType(null), "setRequestHeader" in h && Y.forEach(fd(a), function(e, t) {
			h.setRequestHeader(t, e);
		}), Y.isUndefined(r.withCredentials) || (h.withCredentials = !!r.withCredentials), o && o !== "json" && (h.responseType = r.responseType), c && ([d, p] = af(c, !0), h.addEventListener("progress", d)), s && h.upload && ([u, f] = af(s), h.upload.addEventListener("progress", u), h.upload.addEventListener("loadend", f)), (r.cancelToken || r.signal) && (l = (t) => {
			h &&= (n(!t || t.type ? new $d(null, e, h) : t), h.abort(), m(), null);
		}, r.cancelToken && r.cancelToken.subscribe(l), r.signal && (r.signal.aborted ? l() : r.signal.addEventListener("abort", l)));
		let _ = tf(r.url);
		if (_ && !Q.protocols.includes(_)) {
			n(new Z("Unsupported protocol " + _ + ":", Z.ERR_BAD_REQUEST, e));
			return;
		}
		h.send(i || null);
	});
}, bf = (e, t) => {
	if (e = e ? e.filter(Boolean) : [], !t && !e.length) return;
	let n = new AbortController(), r = !1, i = function(e) {
		if (!r) {
			r = !0, o();
			let t = e instanceof Error ? e : this.reason;
			n.abort(t instanceof Z ? t : new $d(t instanceof Error ? t.message : t));
		}
	}, a = t && setTimeout(() => {
		a = null, i(new Z(`timeout of ${t}ms exceeded`, Z.ETIMEDOUT));
	}, t), o = () => {
		e &&= (a && clearTimeout(a), a = null, e.forEach((e) => {
			e.unsubscribe ? e.unsubscribe(i) : e.removeEventListener("abort", i);
		}), null);
	};
	e.forEach((e) => e.addEventListener("abort", i));
	let { signal: s } = n;
	return s.unsubscribe = () => Y.asap(o), s;
}, xf = function* (e, t) {
	let n = e.byteLength;
	if (!t || n < t) {
		yield e;
		return;
	}
	let r = 0, i;
	for (; r < n;) i = r + t, yield e.slice(r, i), r = i;
}, Sf = async function* (e, t) {
	for await (let n of Cf(e)) yield* xf(n, t);
}, Cf = async function* (e) {
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
}, wf = (e, t, n, r) => {
	let i = Sf(e, t), a = 0, o, s = (e) => {
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
function Tf(e) {
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
var Ef = "1.16.1", Df = 64 * 1024, { isFunction: Of } = Y, kf = (e, ...t) => {
	try {
		return !!e(...t);
	} catch {
		return !1;
	}
}, Af = (e) => {
	let t = Y.global !== void 0 && Y.global !== null ? Y.global : globalThis, { ReadableStream: n, TextEncoder: r } = t;
	e = Y.merge.call({ skipUndefined: !0 }, {
		Request: t.Request,
		Response: t.Response
	}, e);
	let { fetch: i, Request: a, Response: o } = e, s = i ? Of(i) : typeof fetch == "function", c = Of(a), l = Of(o);
	if (!s) return !1;
	let u = s && Of(n), d = s && (typeof r == "function" ? ((e) => (t) => e.encode(t))(new r()) : async (e) => new Uint8Array(await new a(e).arrayBuffer())), f = c && u && kf(() => {
		let e = !1, t = new a(Q.origin, {
			body: new n(),
			method: "POST",
			get duplex() {
				return e = !0, "half";
			}
		}), r = t.headers.has("Content-Type");
		return t.body != null && t.body.cancel(), e && !r;
	}), p = l && u && kf(() => Y.isReadableStream(new o("").body)), m = { stream: p && ((e) => e.body) };
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
			throw new Z(`Response type '${e}' is not supported`, Z.ERR_NOT_SUPPORT, n);
		});
	});
	let h = async (e) => {
		if (e == null) return 0;
		if (Y.isBlob(e)) return e.size;
		if (Y.isSpecCompliantForm(e)) return (await new a(Q.origin, {
			method: "POST",
			body: e
		}).arrayBuffer()).byteLength;
		if (Y.isArrayBufferView(e) || Y.isArrayBuffer(e)) return e.byteLength;
		if (Y.isURLSearchParams(e) && (e += ""), Y.isString(e)) return (await d(e)).byteLength;
	}, g = async (e, t) => Y.toFiniteNumber(e.getContentLength()) ?? h(t);
	return async (e) => {
		let { url: t, method: n, data: s, signal: l, cancelToken: u, timeout: d, onDownloadProgress: h, onUploadProgress: _, responseType: v, headers: y, withCredentials: b = "same-origin", fetchOptions: x, maxContentLength: S, maxBodyLength: C } = vf(e), w = Y.isNumber(S) && S > -1, T = Y.isNumber(C) && C > -1, E = i || fetch;
		v = v ? (v + "").toLowerCase() : "text";
		let D = bf([l, u && u.toAbortSignal()], d), O = null, k = D && D.unsubscribe && (() => {
			D.unsubscribe();
		}), ee;
		try {
			if (w && typeof t == "string" && t.startsWith("data:") && Tf(t) > S) throw new Z("maxContentLength size of " + S + " exceeded", Z.ERR_BAD_RESPONSE, e, O);
			if (T && n !== "get" && n !== "head") {
				let t = await g(y, s);
				if (typeof t == "number" && isFinite(t) && t > C) throw new Z("Request body larger than maxBodyLength limit", Z.ERR_BAD_REQUEST, e, O);
			}
			if (_ && f && n !== "get" && n !== "head" && (ee = await g(y, s)) !== 0) {
				let e = new a(t, {
					method: "POST",
					body: s,
					duplex: "half"
				}), n;
				if (Y.isFormData(s) && (n = e.headers.get("content-type")) && y.setContentType(n), e.body) {
					let [t, n] = of(ee, af(sf(_)));
					s = wf(e.body, Df, t, n);
				}
			}
			Y.isString(b) || (b = b ? "include" : "omit");
			let i = c && "credentials" in a.prototype;
			if (Y.isFormData(s)) {
				let e = y.getContentType();
				e && /^multipart\/form-data/i.test(e) && !/boundary=/i.test(e) && y.delete("content-type");
			}
			y.set("User-Agent", "axios/" + Ef, !1);
			let l = {
				...x,
				signal: D,
				method: n.toUpperCase(),
				headers: fd(y.normalize()),
				body: s,
				duplex: "half",
				credentials: i ? b : void 0
			};
			O = c && new a(t, l);
			let u = await (c ? E(O, x) : E(t, l));
			if (w) {
				let t = Y.toFiniteNumber(u.headers.get("content-length"));
				if (t != null && t > S) throw new Z("maxContentLength size of " + S + " exceeded", Z.ERR_BAD_RESPONSE, e, O);
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
				let n = Y.toFiniteNumber(u.headers.get("content-length")), [r, i] = h && of(n, af(sf(h), !0)) || [], a = 0;
				u = new o(wf(u.body, Df, (t) => {
					if (w && (a = t, a > S)) throw new Z("maxContentLength size of " + S + " exceeded", Z.ERR_BAD_RESPONSE, e, O);
					r && r(t);
				}, () => {
					i && i(), k && k();
				}), t);
			}
			v ||= "text";
			let A = await m[Y.findKey(m, v) || "text"](u, e);
			if (w && !p && !d) {
				let t;
				if (A != null && (typeof A.byteLength == "number" ? t = A.byteLength : typeof A.size == "number" ? t = A.size : typeof A == "string" && (t = typeof r == "function" ? new r().encode(A).byteLength : A.length)), typeof t == "number" && t > S) throw new Z("maxContentLength size of " + S + " exceeded", Z.ERR_BAD_RESPONSE, e, O);
			}
			return !d && k && k(), await new Promise((t, n) => {
				ef(t, n, {
					data: A,
					headers: X.from(u.headers),
					status: u.status,
					statusText: u.statusText,
					config: e,
					request: O
				});
			});
		} catch (t) {
			if (k && k(), D && D.aborted && D.reason instanceof Z) {
				let n = D.reason;
				throw n.config = e, O && (n.request = O), t !== n && (n.cause = t), n;
			}
			throw t && t.name === "TypeError" && /Load failed|fetch/i.test(t.message) ? Object.assign(new Z("Network Error", Z.ERR_NETWORK, e, O, t && t.response), { cause: t.cause || t }) : Z.from(t, t && t.code, e, O, t && t.response);
		}
	};
}, jf = /* @__PURE__ */ new Map(), Mf = (e) => {
	let t = e && e.env || {}, { fetch: n, Request: r, Response: i } = t, a = [
		r,
		i,
		n
	], o = a.length, s, c, l = jf;
	for (; o--;) s = a[o], c = l.get(s), c === void 0 && l.set(s, c = o ? /* @__PURE__ */ new Map() : Af(t)), l = c;
	return c;
};
Mf();
//#endregion
//#region node_modules/axios/lib/adapters/adapters.js
var Nf = {
	http: null,
	xhr: yf,
	fetch: { get: Mf }
};
Y.forEach(Nf, (e, t) => {
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
var Pf = (e) => `- ${e}`, Ff = (e) => Y.isFunction(e) || e === null || e === !1;
function If(e, t) {
	e = Y.isArray(e) ? e : [e];
	let { length: n } = e, r, i, a = {};
	for (let o = 0; o < n; o++) {
		r = e[o];
		let n;
		if (i = r, !Ff(r) && (i = Nf[(n = String(r)).toLowerCase()], i === void 0)) throw new Z(`Unknown adapter '${n}'`);
		if (i && (Y.isFunction(i) || (i = i.get(t)))) break;
		a[n || "#" + o] = i;
	}
	if (!i) {
		let e = Object.entries(a).map(([e, t]) => `adapter ${e} ` + (t === !1 ? "is not supported by the environment" : "is not available in the build"));
		throw new Z("There is no suitable adapter to dispatch the request " + (n ? e.length > 1 ? "since :\n" + e.map(Pf).join("\n") : " " + Pf(e[0]) : "as no adapter specified"), "ERR_NOT_SUPPORT");
	}
	return i;
}
var Lf = {
	getAdapter: If,
	adapters: Nf
};
//#endregion
//#region node_modules/axios/lib/core/dispatchRequest.js
function Rf(e) {
	if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new $d(null, e);
}
function zf(e) {
	return Rf(e), e.headers = X.from(e.headers), e.data = Zd.call(e, e.transformRequest), [
		"post",
		"put",
		"patch"
	].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Lf.getAdapter(e.adapter || Xd.adapter, e)(e).then(function(t) {
		Rf(e), e.response = t;
		try {
			t.data = Zd.call(e, e.transformResponse, t);
		} finally {
			delete e.response;
		}
		return t.headers = X.from(t.headers), t;
	}, function(t) {
		if (!Qd(t) && (Rf(e), t && t.response)) {
			e.response = t.response;
			try {
				t.response.data = Zd.call(e, e.transformResponse, t.response);
			} finally {
				delete e.response;
			}
			t.response.headers = X.from(t.response.headers);
		}
		return Promise.reject(t);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/validator.js
var Bf = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((e, t) => {
	Bf[e] = function(n) {
		return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
	};
});
var Vf = {};
Bf.transitional = function(e, t, n) {
	function r(e, t) {
		return "[Axios v" + Ef + "] Transitional option '" + e + "'" + t + (n ? ". " + n : "");
	}
	return (n, i, a) => {
		if (e === !1) throw new Z(r(i, " has been removed" + (t ? " in " + t : "")), Z.ERR_DEPRECATED);
		return t && !Vf[i] && (Vf[i] = !0, console.warn(r(i, " has been deprecated since v" + t + " and will be removed in the near future"))), e ? e(n, i, a) : !0;
	};
}, Bf.spelling = function(e) {
	return (t, n) => (console.warn(`${n} is likely a misspelling of ${e}`), !0);
};
function Hf(e, t, n) {
	if (typeof e != "object") throw new Z("options must be an object", Z.ERR_BAD_OPTION_VALUE);
	let r = Object.keys(e), i = r.length;
	for (; i-- > 0;) {
		let a = r[i], o = Object.prototype.hasOwnProperty.call(t, a) ? t[a] : void 0;
		if (o) {
			let t = e[a], n = t === void 0 || o(t, a, e);
			if (n !== !0) throw new Z("option " + a + " must be " + n, Z.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (n !== !0) throw new Z("Unknown option " + a, Z.ERR_BAD_OPTION);
	}
}
var Uf = {
	assertOptions: Hf,
	validators: Bf
}, Wf = Uf.validators, Gf = class {
	constructor(e) {
		this.defaults = e || {}, this.interceptors = {
			request: new Fd(),
			response: new Fd()
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
		typeof e == "string" ? (t ||= {}, t.url = e) : t = e || {}, t = mf(this.defaults, t);
		let { transitional: n, paramsSerializer: r, headers: i } = t;
		n !== void 0 && Uf.assertOptions(n, {
			silentJSONParsing: Wf.transitional(Wf.boolean),
			forcedJSONParsing: Wf.transitional(Wf.boolean),
			clarifyTimeoutError: Wf.transitional(Wf.boolean),
			legacyInterceptorReqResOrdering: Wf.transitional(Wf.boolean)
		}, !1), r != null && (Y.isFunction(r) ? t.paramsSerializer = { serialize: r } : Uf.assertOptions(r, {
			encode: Wf.function,
			serialize: Wf.function
		}, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls === void 0 ? t.allowAbsoluteUrls = !0 : t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls), Uf.assertOptions(t, {
			baseUrl: Wf.spelling("baseURL"),
			withXsrfToken: Wf.spelling("withXSRFToken")
		}, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
		let a = i && Y.merge(i.common, i[t.method]);
		i && Y.forEach([
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
		}), t.headers = X.concat(a, i);
		let o = [], s = !0;
		this.interceptors.request.forEach(function(e) {
			if (typeof e.runWhen == "function" && e.runWhen(t) === !1) return;
			s &&= e.synchronous;
			let n = t.transitional || Id;
			n && n.legacyInterceptorReqResOrdering ? o.unshift(e.fulfilled, e.rejected) : o.push(e.fulfilled, e.rejected);
		});
		let c = [];
		this.interceptors.response.forEach(function(e) {
			c.push(e.fulfilled, e.rejected);
		});
		let l, u = 0, d;
		if (!s) {
			let e = [zf.bind(this), void 0];
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
			l = zf.call(this, f);
		} catch (e) {
			return Promise.reject(e);
		}
		for (u = 0, d = c.length; u < d;) l = l.then(c[u++], c[u++]);
		return l;
	}
	getUri(e) {
		return e = mf(this.defaults, e), Pd(ff(e.baseURL, e.url, e.allowAbsoluteUrls), e.params, e.paramsSerializer);
	}
};
Y.forEach([
	"delete",
	"get",
	"head",
	"options"
], function(e) {
	Gf.prototype[e] = function(t, n) {
		return this.request(mf(n || {}, {
			method: e,
			url: t,
			data: (n || {}).data
		}));
	};
}), Y.forEach([
	"post",
	"put",
	"patch",
	"query"
], function(e) {
	function t(t) {
		return function(n, r, i) {
			return this.request(mf(i || {}, {
				method: e,
				headers: t ? { "Content-Type": "multipart/form-data" } : {},
				url: n,
				data: r
			}));
		};
	}
	Gf.prototype[e] = t(), e !== "query" && (Gf.prototype[e + "Form"] = t(!0));
});
//#endregion
//#region node_modules/axios/lib/cancel/CancelToken.js
var Kf = class e {
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
			n.reason || (n.reason = new $d(e, r, i), t(n.reason));
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
function qf(e) {
	return function(t) {
		return e.apply(null, t);
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/isAxiosError.js
function Jf(e) {
	return Y.isObject(e) && e.isAxiosError === !0;
}
//#endregion
//#region node_modules/axios/lib/helpers/HttpStatusCode.js
var Yf = {
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
Object.entries(Yf).forEach(([e, t]) => {
	Yf[t] = e;
});
//#endregion
//#region node_modules/axios/lib/axios.js
function Xf(e) {
	let t = new Gf(e), n = Jl(Gf.prototype.request, t);
	return Y.extend(n, Gf.prototype, t, { allOwnKeys: !0 }), Y.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(t) {
		return Xf(mf(e, t));
	}, n;
}
var $ = Xf(Xd);
$.Axios = Gf, $.CanceledError = $d, $.CancelToken = Kf, $.isCancel = Qd, $.VERSION = Ef, $.toFormData = kd, $.AxiosError = Z, $.Cancel = $.CanceledError, $.all = function(e) {
	return Promise.all(e);
}, $.spread = qf, $.isAxiosError = Jf, $.mergeConfig = mf, $.AxiosHeaders = X, $.formToJSON = (e) => qd(Y.isHTMLForm(e) ? new FormData(e) : e), $.getAdapter = Lf.getAdapter, $.HttpStatusCode = Yf, $.default = $;
//#endregion
//#region src/api.js
var Zf = "/api/v1", Qf = (e) => !!(e?.isBackendOffline || typeof e?.response?.status == "number" && e.response.status >= 500 || e?.code === "ERR_NETWORK" || e?.code === "ECONNABORTED" || e?.message === "Network Error" || !e?.response && e?.request), $f = $.create({
	baseURL: Zf,
	timeout: 3500
});
$f.interceptors.response.use((e) => e, (e) => (!e.response && (e.request || e.message === "Network Error") && (e.isBackendOffline = !0, e.message = "Backend is not connected. Start the backend server to enable blog data."), Promise.reject(e)));
var ep = (e) => e ? { headers: { Authorization: `Bearer ${e}` } } : {}, tp = () => $f.get("/articles"), np = (e) => $f.get("/articles/search", { params: { q: e } }), rp = (e, t) => $f.post("/articles", e, ep(t)), ip = (e, t, n) => $f.put(`/articles/${e}`, t, ep(n)), ap = (e, t) => $f.delete(`/articles/${e}`, ep(t)), op = (e, t) => {
	let n = new FormData();
	return n.append("file", e), $f.post("/uploads/images", n, {
		...ep(t),
		headers: {
			...t ? { Authorization: `Bearer ${t}` } : {},
			"Content-Type": "multipart/form-data"
		}
	});
}, sp = (e, t, n, r) => $f.post(`/articles/${e}/view`, null, { headers: {
	"X-Visitor-Id": t,
	"X-Event-Id": r,
	"X-Content-Path": n
} });
//#endregion
//#region src/pages/Blog.jsx
function cp(e) {
	let t = new Date(e);
	return `${t.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	})} ${t.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: !1
	})}`.toUpperCase();
}
function lp(e = "") {
	return String(e ?? "").replace(/```[\s\S]*?```/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/^#{1,6}\s*/gm, "").replace(/^[-*>|]+\s*/gm, "").replace(/[`*_~]/g, "").replace(/\s+/g, " ").trim().slice(0, 120) || "文章摘要暂不可用。";
}
function up(e, t) {
	return e.response?.data?.error || e.response?.data?.message || e.message || t;
}
function dp(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function fp(e, t) {
	if (!e) return e;
	let n = {};
	return dp(t?.view_count) && (n.view_count = t.view_count), dp(t?.like_count) && (n.like_count = t.like_count), Object.keys(n).length > 0 ? {
		...e,
		...n
	} : e;
}
function pp() {
	let e = "fyuo_visitor_id", t = localStorage.getItem(e);
	if (t) return t;
	let n = typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : `visitor-${Date.now()}`;
	return localStorage.setItem(e, n), n;
}
function mp() {
	return /* @__PURE__ */ z(ql, {
		strength: .75,
		children: /* @__PURE__ */ B("article", {
			className: "journal-entry journal-entry--offline",
			role: "status",
			children: [/* @__PURE__ */ z("div", {
				className: "journal-entry__meta",
				children: /* @__PURE__ */ z("time", {
					dateTime: (/* @__PURE__ */ new Date()).toISOString(),
					children: cp((/* @__PURE__ */ new Date()).toISOString())
				})
			}), /* @__PURE__ */ B("div", {
				className: "journal-entry__content",
				children: [/* @__PURE__ */ z("h2", { children: "文章服务暂不可用。" }), /* @__PURE__ */ B("div", {
					className: "journal-entry__preview",
					children: [/* @__PURE__ */ z("p", { children: "文章列表、搜索、点赞、浏览量和管理功能会在服务恢复后自动可用。页面其余内容仍然可以正常浏览。" }), /* @__PURE__ */ z("code", {
						className: "journal-entry__system-message",
						children: "API service is unavailable. Please try again shortly."
					})]
				})]
			})]
		})
	});
}
function hp({ user: e, onOpenSignIn: t, onLogout: n, onNotify: r, drawerItems: i, showDrawer: a = !0, portalTarget: o = document.body }) {
	let s = S(), c = x(), [l, d] = _([]), [m, h] = _(null), [v, b] = _(!1), [C, w] = _(""), [T, E] = _([]), [D, O] = _(!1), [k, ee] = _(!1), A = g(null), te = g(null), j = g(null), M = g({
		active: !1,
		idleAngle: 0,
		x: 8,
		y: 0,
		targetX: 8,
		targetY: 0,
		lastTime: null
	}), ne = g("");
	p(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let e, t = (n) => {
			let r = M.current, i = Math.min(32, n - (r.lastTime ?? n));
			r.lastTime = n, r.active || (r.idleAngle += i / 18e3 * Math.PI * 2, r.targetX = Math.cos(r.idleAngle) * 8, r.targetY = Math.sin(r.idleAngle) * 8);
			let a = 1 - Math.exp(-i / (r.active ? 90 : 180));
			r.x += (r.targetX - r.x) * a, r.y += (r.targetY - r.y) * a, j.current?.style.setProperty("--journal-scatter-x", `${r.x}px`), j.current?.style.setProperty("--journal-scatter-y", `${r.y}px`), e = requestAnimationFrame(t);
		};
		return e = requestAnimationFrame(t), () => cancelAnimationFrame(e);
	}, []);
	let re = g(null);
	re.current === null && (re.current = u(sp));
	let N = f(() => {
		k || tp().then((e) => {
			ee(!1), d(e.data.data ?? []);
		}).catch((e) => {
			if (Qf(e)) {
				ee(!0), d([]), E([]), O(!1);
				return;
			}
			r?.({
				variant: "error",
				title: "load-failed.",
				message: up(e, "文章列表加载失败。")
			});
		});
	}, [k, r]);
	p(() => {
		m || N();
	}, [m, N]), p(() => {
		if (!m?.id) {
			re.current.select(null);
			return;
		}
		k || re.current.select(m.id, pp(), `/blog/${m.id}`).then((e) => {
			let t = e.data ?? {};
			d((e) => e.map((e) => e.id === m.id ? fp(e, t) : e)), h((e) => e?.id === m.id ? fp(e, t) : e);
		}).catch(() => {});
	}, [
		m?.id,
		k,
		r
	]), p(() => {
		let e = (e) => {
			te.current && !te.current.contains(e.target) && O(!1);
		};
		return document.addEventListener("mousedown", e), () => {
			document.removeEventListener("mousedown", e);
		};
	}, []);
	let P = () => {
		if (k) {
			r?.({
				variant: "info",
				title: "backend-offline.",
				message: "当前未连接后端，搜索功能暂不可用。"
			});
			return;
		}
		let e = C.trim();
		if (!e) {
			E([]), O(!1);
			return;
		}
		np(e).then((e) => {
			E(e.data.data ?? []), O(!0);
		}).catch((e) => {
			if (Qf(e)) {
				ee(!0), E([]), O(!1);
				return;
			}
			r?.({
				variant: "error",
				title: "search-failed.",
				message: up(e, "搜索失败。")
			});
		});
	}, ie = (e) => {
		w(e.target.value), e.target.value.trim() === "" && (E([]), O(!1));
	}, F = (e) => {
		w(""), E([]), O(!1), h(e);
	}, I = m !== null, ae = m?.id == null, L = I ? ae ? [{
		label: "save,",
		action: "save"
	}, {
		label: "discard,",
		action: "discard"
	}] : v ? [
		{
			label: "save,",
			action: "save"
		},
		{
			label: "discard,",
			action: "discard"
		},
		{
			label: "back,",
			action: "back"
		}
	] : [
		{
			label: "edit,",
			action: "edit"
		},
		{
			label: "delete,",
			action: "delete"
		},
		{
			label: "back,",
			action: "back"
		}
	] : [], oe = () => {
		h(null), b(!1), w("");
	}, se = (e, i) => {
		let a = e.response?.status;
		if (Qf(e)) {
			ee(!0), r?.({
				variant: "info",
				title: "backend-offline.",
				message: "当前未连接后端，此操作暂不可用。"
			});
			return;
		}
		if (a === 401) {
			n(), r?.({
				variant: "error",
				title: "session-expired.",
				message: up(e, "登录已过期，请重新登录。")
			}), t();
			return;
		}
		r?.({
			variant: "error",
			title: "request-failed.",
			message: up(e, i)
		});
	}, ce = (i) => {
		if (k && [
			"create",
			"save",
			"delete"
		].includes(i)) {
			r?.({
				variant: "info",
				title: "backend-offline.",
				message: "当前未连接后端，文章管理功能暂不可用。"
			});
			return;
		}
		if (i === "create" && (h({
			id: null,
			title: "New Article",
			content: "",
			cover_image: "",
			stage: "published",
			vol: 1,
			tags: [],
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}), b(!0)), i === "back" && oe(), i === "edit" && b(!0), i === "save") {
			if (!e?.token) {
				r?.({
					variant: "error",
					title: "login-required.",
					message: "登录状态不可用，请重新登录后再保存。"
				}), n(), t();
				return;
			}
			let i = A.current?.getContent() ?? m.content, a = A.current?.getTitle() ?? m.title, o = A.current?.getCoverImage?.() ?? m.cover_image ?? "", s = A.current?.getTags() ?? m.tags ?? [], c = e.token;
			ae ? rp({
				title: a,
				content: i,
				cover_image: o,
				stage: "published",
				vol: 1,
				tags: s
			}, c).then(() => {
				oe(), r?.({
					variant: "success",
					title: "article-created.",
					message: "文章已经创建并刷新缓存。"
				});
			}).catch((e) => {
				se(e, "创建失败。");
			}) : ip(m.id, {
				title: a,
				content: i,
				cover_image: o,
				tags: s
			}, c).then((e) => {
				h(e.data.data), b(!1), r?.({
					variant: "success",
					title: "article-saved.",
					message: "文章已经保存。"
				});
			}).catch((e) => {
				se(e, "更新失败。");
			});
		}
		if (i === "delete") {
			if (!e?.token) {
				r?.({
					variant: "error",
					title: "login-required.",
					message: "登录状态不可用，请重新登录后再删除。"
				}), n(), t();
				return;
			}
			ap(m.id, e.token).then(() => {
				oe(), r?.({
					variant: "success",
					title: "article-deleted.",
					message: "文章已标记为隐藏。"
				});
			}).catch((e) => {
				se(e, "删除失败。");
			});
		}
		if (i === "discard") {
			if (ae) {
				oe();
				return;
			}
			b(!1);
		}
	};
	p(() => {
		let t = new URLSearchParams(c.search), n = t.get("desk");
		if (!e?.token || !n || ne.current === c.search) return;
		let r = window.setTimeout(() => {
			if (n === "new") {
				h({
					id: null,
					title: "New Article",
					content: "",
					cover_image: "",
					stage: "published",
					vol: 1,
					tags: [],
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				}), b(!0), ne.current = c.search;
				return;
			}
			let e = Number(t.get("id")), r = l.find((t) => t.id === e);
			n === "edit" && r && (h(r), b(!0), ne.current = c.search);
		}, 0);
		return () => window.clearTimeout(r);
	}, [
		c.search,
		l,
		e?.token
	]);
	let le = [
		{
			label: "content desk.",
			onClick: () => s("/desk")
		},
		...I ? L.map((e) => ({
			label: e.label,
			onClick: () => ce(e.action)
		})) : [],
		...i
	];
	return /* @__PURE__ */ B("div", {
		className: "blog-page",
		children: [
			/* @__PURE__ */ z(Gl, {}),
			a && y(/* @__PURE__ */ z(Kl, {
				user: e,
				label: "blog.",
				items: le,
				onOpenSignIn: t,
				placement: "frame"
			}), document.getElementById("root")),
			/* @__PURE__ */ z(ql, {
				strength: 1,
				children: /* @__PURE__ */ z("div", { children: /* @__PURE__ */ B("header", {
					className: "blog-hero",
					onPointerMove: (e) => {
						let t = e.currentTarget.getBoundingClientRect(), n = (e.clientX - t.left) / t.width - .5, r = (e.clientY - t.top) / t.height - .5, i = n * 12, a = r * 8, o = 6 + Math.min(10, Math.hypot(i, a) * .9), s = Math.hypot(n, r) || 1, c = n / s * o, l = r / s * o, u = M.current;
						u.active = !0, u.targetX = c, u.targetY = l;
						let d = j.current;
						d?.style.setProperty("--journal-refraction-x", `${i}px`), d?.style.setProperty("--journal-refraction-y", `${a}px`), window.matchMedia("(prefers-reduced-motion: reduce)").matches && (d?.style.setProperty("--journal-scatter-x", `${c}px`), d?.style.setProperty("--journal-scatter-y", `${l}px`));
					},
					onPointerLeave: () => {
						let e = M.current;
						e.active = !1, e.idleAngle = Math.atan2(e.y, e.x);
						let t = j.current;
						t?.style.setProperty("--journal-refraction-x", "0px"), t?.style.setProperty("--journal-refraction-y", "0px");
					},
					children: [
						/* @__PURE__ */ z("p", {
							className: "blog-eyebrow",
							children: "journal / field notes"
						}),
						/* @__PURE__ */ z("h1", {
							className: "blog-title blog-title--oil",
							ref: j,
							children: /* @__PURE__ */ z("span", {
								className: "blog-title__ink",
								"data-title": "The Journal.",
								children: "The Journal."
							})
						}),
						/* @__PURE__ */ z("p", {
							className: "blog-lede",
							children: "个人博客"
						})
					]
				}) })
			}),
			/* @__PURE__ */ z(ql, {
				strength: .9,
				children: /* @__PURE__ */ z("div", {
					className: "blog-search-band",
					children: /* @__PURE__ */ z("div", { children: /* @__PURE__ */ B("div", {
						className: "blog-search-form",
						children: [/* @__PURE__ */ B("div", {
							className: "relative flex-1",
							ref: te,
							children: [/* @__PURE__ */ z("input", {
								type: "text",
								placeholder: k ? "backend offline." : "search.",
								value: C,
								disabled: k,
								onChange: ie,
								onKeyDown: (e) => {
									e.key === "Enter" && P();
								},
								onFocus: () => {
									T.length > 0 && O(!0);
								},
								className: "blog-search-input w-full px-5 disabled:cursor-not-allowed disabled:opacity-60"
							}), D && T.length > 0 && /* @__PURE__ */ z("div", {
								className: "absolute left-0 right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 shadow-2xl z-50 max-h-80 overflow-y-auto",
								children: T.map((e) => /* @__PURE__ */ B("button", {
									onClick: () => F(e),
									className: "w-full text-left px-5 py-3 hover:bg-white/5 transition-colors border-b border-zinc-800 last:border-b-0",
									children: [/* @__PURE__ */ z("div", {
										className: "text-sm font-semibold text-white truncate",
										children: e.title
									}), /* @__PURE__ */ z("time", {
										className: "text-xs font-mono text-zinc-500 mt-0.5 block",
										children: cp(e.created_at)
									})]
								}, e.id))
							})]
						}), /* @__PURE__ */ z("button", {
							onClick: P,
							disabled: k,
							className: "blog-search-button px-7 disabled:cursor-not-allowed disabled:opacity-60",
							children: "search."
						})]
					}) })
				})
			}),
			k && /* @__PURE__ */ z(mp, {}),
			!k && /* @__PURE__ */ z("div", {
				className: "journal-index",
				children: /* @__PURE__ */ z("div", {
					className: "journal-index__list",
					children: l.map((e) => /* @__PURE__ */ z(ql, {
						strength: 1,
						children: /* @__PURE__ */ B("article", {
							className: "journal-entry",
							children: [/* @__PURE__ */ z("div", {
								className: "journal-entry__meta",
								children: /* @__PURE__ */ z("time", {
									className: "font-mono text-sm tracking-widest text-zinc-500 uppercase",
									children: cp(e.created_at)
								})
							}), /* @__PURE__ */ B("div", {
								className: "journal-entry__content",
								children: [/* @__PURE__ */ z("h2", { children: /* @__PURE__ */ z("button", {
									type: "button",
									onClick: () => h(e),
									children: e.title
								}) }), /* @__PURE__ */ z("div", {
									className: "journal-entry__preview",
									children: e.cover_image ? /* @__PURE__ */ z("img", {
										className: "journal-entry__thumbnail",
										src: e.cover_image,
										alt: "",
										loading: "lazy"
									}) : /* @__PURE__ */ z("p", {
										className: "journal-entry__excerpt",
										children: lp(e.content)
									})
								})]
							})]
						})
					}, e.id))
				})
			}),
			/* @__PURE__ */ z("div", { className: "h-24" }),
			m && y(/* @__PURE__ */ z(Wl, {
				post: m,
				isEditing: v,
				editRef: A,
				onBack: oe,
				onUploadImage: async (n) => {
					if (k) return r?.({
						variant: "info",
						title: "backend-offline.",
						message: "当前未连接后端，图片上传功能暂不可用。"
					}), "";
					if (!e?.token) return r?.({
						variant: "error",
						title: "login-required.",
						message: "请先登录后再上传图片。"
					}), t(), "";
					try {
						return (await op(n, e.token)).data?.data?.url || "";
					} catch (e) {
						return Qf(e) ? (ee(!0), "") : (r?.({
							variant: "error",
							title: "upload-failed.",
							message: up(e, "图片上传失败。")
						}), "");
					}
				}
			}, m.id ?? "new"), o)
		]
	});
}
//#endregion
export { hp as default };
