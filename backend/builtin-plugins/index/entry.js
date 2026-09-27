//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
};
//#endregion
//#region \0blog-plugin-assets
function n(e) {
	return new URL(e, import.meta.url).href;
}
//#endregion
//#region \0blog-host:react
var r = globalThis.__FYUO_PLUGIN_HOST_V1__?.react;
if (!r) throw Error("Plugin requires blog host API v1");
r.default, r.Activity;
var i = r.Children;
r.Component, r.Fragment, r.Profiler, r.PureComponent, r.StrictMode, r.Suspense, r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, r.__COMPILER_RUNTIME, r.act, r.cache, r.cacheSignal, r.captureOwnerStack, r.cloneElement, r.createContext, r.createElement, r.createRef, r.forwardRef, r.isValidElement, r.lazy, r.memo, r.startTransition, r.unstable_useCacheRefresh, r.use, r.useActionState, r.useCallback, r.useContext, r.useDebugValue, r.useDeferredValue;
var a = r.useEffect;
r.useEffectEvent, r.useId, r.useImperativeHandle, r.useInsertionEffect, r.useLayoutEffect, r.useMemo, r.useOptimistic, r.useReducer;
var o = r.useRef, s = r.useState;
r.useSyncExternalStore, r.useTransition, r.version;
//#endregion
//#region \0blog-host:react-router-dom
var c = globalThis.__FYUO_PLUGIN_HOST_V1__?.["react-router-dom"];
if (!c) throw Error("Plugin requires blog host API v1");
c.default, c.Await, c.BrowserRouter, c.Form, c.HashRouter, c.HydratedRouter, c.IDLE_BLOCKER, c.IDLE_FETCHER, c.IDLE_NAVIGATION, c.Link, c.Links, c.MemoryRouter, c.Meta, c.NavLink, c.Navigate, c.NavigationType, c.Outlet, c.PrefetchPageLinks, c.Route, c.Router, c.RouterContextProvider, c.RouterProvider, c.Routes, c.Scripts, c.ScrollRestoration, c.ServerRouter, c.StaticRouter, c.StaticRouterProvider, c.UNSAFE_AwaitContextProvider, c.UNSAFE_DataRouterContext, c.UNSAFE_DataRouterStateContext, c.UNSAFE_ErrorResponseImpl, c.UNSAFE_FetchersContext, c.UNSAFE_FrameworkContext, c.UNSAFE_LocationContext, c.UNSAFE_NavigationContext, c.UNSAFE_RSCDefaultRootErrorBoundary, c.UNSAFE_RemixErrorBoundary, c.UNSAFE_RouteContext, c.UNSAFE_ServerMode, c.UNSAFE_SingleFetchRedirectSymbol, c.UNSAFE_ViewTransitionContext, c.UNSAFE_WithComponentProps, c.UNSAFE_WithErrorBoundaryProps, c.UNSAFE_WithHydrateFallbackProps, c.UNSAFE_createBrowserHistory, c.UNSAFE_createClientRoutes, c.UNSAFE_createClientRoutesWithHMRRevalidationOptOut, c.UNSAFE_createHashHistory, c.UNSAFE_createMemoryHistory, c.UNSAFE_createRouter, c.UNSAFE_decodeViaTurboStream, c.UNSAFE_deserializeErrors, c.UNSAFE_getHydrationData, c.UNSAFE_getPatchRoutesOnNavigationFunction, c.UNSAFE_getTurboStreamSingleFetchDataStrategy, c.UNSAFE_hydrationRouteProperties, c.UNSAFE_invariant, c.UNSAFE_mapRouteProperties, c.UNSAFE_shouldHydrateRouteLoader, c.UNSAFE_useFogOFWarDiscovery, c.UNSAFE_useScrollRestoration, c.UNSAFE_withComponentProps, c.UNSAFE_withErrorBoundaryProps, c.UNSAFE_withHydrateFallbackProps, c.createBrowserRouter, c.createContext, c.createCookie, c.createCookieSessionStorage, c.createHashRouter, c.createMemoryRouter, c.createMemorySessionStorage, c.createPath, c.createRequestHandler, c.createRoutesFromChildren, c.createRoutesFromElements, c.createRoutesStub, c.createSearchParams, c.createSession, c.createSessionStorage, c.createStaticHandler, c.createStaticRouter, c.data, c.generatePath, c.href, c.isCookie, c.isRouteErrorResponse, c.isSession, c.matchPath, c.matchRoutes, c.parsePath, c.redirect, c.redirectDocument, c.renderMatches, c.replace, c.resolvePath, c.unstable_HistoryRouter, c.unstable_RSCStaticRouter, c.unstable_routeRSCServerRequest, c.unstable_setDevServerHooks, c.unstable_usePrompt, c.unstable_useRoute, c.unstable_useRouterState, c.useActionData, c.useAsyncError, c.useAsyncValue, c.useBeforeUnload, c.useBlocker, c.useFetcher, c.useFetchers, c.useFormAction, c.useHref, c.useInRouterContext, c.useLinkClickHandler, c.useLoaderData;
var l = c.useLocation;
c.useMatch, c.useMatches, c.useNavigate, c.useNavigation, c.useNavigationType, c.useOutlet, c.useOutletContext, c.useParams, c.useResolvedPath, c.useRevalidator, c.useRouteError, c.useRouteLoaderData, c.useRoutes, c.useSearchParams, c.useSubmit, c.useViewTransitionState;
//#endregion
//#region \0blog-host:react/jsx-runtime
var u = globalThis.__FYUO_PLUGIN_HOST_V1__?.["react/jsx-runtime"];
if (!u) throw Error("Plugin requires blog host API v1");
u.default, u.Fragment;
var d = u.jsx, f = u.jsxs;
//#endregion
//#region src/module/GithubIcon.jsx
function p({ size: e = 20 }) {
	return /* @__PURE__ */ d("svg", {
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "currentColor",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ d("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" })
	});
}
//#endregion
//#region src/module/FeatureCard.jsx
function m({ image: e, title: t, githubUrl: n, description: r, linkUrl: i }) {
	let a = /* @__PURE__ */ f("article", {
		className: "feature-card",
		children: [/* @__PURE__ */ d("div", {
			className: "feature-card__image",
			children: /* @__PURE__ */ d("img", {
				src: e,
				alt: t
			})
		}), /* @__PURE__ */ f("div", {
			className: "feature-card__content",
			children: [
				/* @__PURE__ */ d("p", {
					className: "feature-card__label",
					children: "cover story / 01"
				}),
				/* @__PURE__ */ d("h2", {
					className: "feature-card__title",
					children: t
				}),
				r && /* @__PURE__ */ d("p", {
					className: "feature-card__description",
					children: r
				}),
				n && /* @__PURE__ */ d("a", {
					className: "feature-card__source",
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					"aria-label": `${t} on GitHub`,
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ d(p, { size: 21 })
				})
			]
		})]
	});
	return i ? /* @__PURE__ */ d("a", {
		href: i,
		target: "_blank",
		rel: "noopener noreferrer",
		children: a
	}) : a;
}
//#endregion
//#region src/module/ProjectGrid.jsx
var h = (e, t, n) => Math.min(Math.max(e, t), n), g = (e, t) => {
	let n = e * 15 - 165, r = [];
	for (let e = -120; e <= 1320; e += 24) {
		let i = Math.hypot((e - 600 + Math.sin(t * .26) * 38) * .78, n - 450), a = Math.sin(i * .073) * 28 * Math.exp(-i / 245), o = Math.sin(e * .012 + t * .22) * 28 + Math.sin(n * .31 + e * .007 + t * .48) * 16 + Math.sin(e * .008 - n * .09 + t * .74) * 5 + a;
		r.push(`${e === -120 ? "M" : "L"} ${e} ${n + o}`);
	}
	return r.join(" ");
}, _ = (e = 0) => Array.from({ length: 86 }, (t, n) => ({
	path: g(n, e),
	width: .52 + ((Math.sin(n * 1.91 + e * 1.08) + 1) / 2) ** 2 * 1.18
})), v = () => {
	let [e, t] = s(() => _());
	return a(() => {
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), n = 0, r = 0, i = performance.now(), a = (o) => {
			!e.matches && o - r >= 1e3 / 18 && (t(_((o - i) / 1e3)), r = o), n = window.requestAnimationFrame(a);
		}, o = () => {
			if (window.cancelAnimationFrame(n), e.matches) {
				t(_());
				return;
			}
			i = performance.now(), r = 0, n = window.requestAnimationFrame(a);
		};
		return o(), e.addEventListener("change", o), () => {
			window.cancelAnimationFrame(n), e.removeEventListener("change", o);
		};
	}, []), e;
};
function y({ lines: e, className: t = "cover-flow__wood-grain" }) {
	return /* @__PURE__ */ d("svg", {
		className: t,
		viewBox: "0 0 1200 900",
		preserveAspectRatio: "none",
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ d("g", {
			className: "cover-flow__wood-grain-line",
			children: e.map((e, t) => /* @__PURE__ */ d("path", {
				d: e.path,
				strokeWidth: e.width
			}, `grain-${t}`))
		})
	});
}
function b({ projects: e = [] }) {
	let [t, n] = s(0), [r, i] = s("forward"), [c, l] = s(!1), u = v(), p = o(null), m = o(!1), g = o(0), _ = h(t, 0, Math.max(0, e.length - 1));
	if (a(() => {
		g.current = _;
	}, [_]), !e.length) return null;
	let b = e[_], x = (t) => {
		let r = h(t, 0, e.length - 1), a = g.current;
		r !== a && (g.current = r, i(r > a ? "forward" : "backward"), n(r));
	}, S = (e) => x(g.current + e), C = (e) => {
		e.key === "ArrowLeft" && (e.preventDefault(), S(-1)), e.key === "ArrowRight" && (e.preventDefault(), S(1));
	}, w = (e) => {
		e.button === 0 && (p.current = {
			pointerId: e.pointerId,
			startX: e.clientX,
			lastX: e.clientX,
			lastTime: e.timeStamp,
			velocity: 0,
			step: Math.max(72, e.currentTarget.clientWidth * .22),
			startIndex: _
		}, l(!0), e.currentTarget.setPointerCapture(e.pointerId));
	}, T = (t) => {
		let n = p.current;
		if (n?.pointerId !== t.pointerId) return;
		let r = Math.max(1, t.timeStamp - n.lastTime), i = (t.clientX - n.lastX) / r;
		n.velocity = n.velocity * .72 + i * .28, n.lastX = t.clientX, n.lastTime = t.timeStamp, x(h(n.startIndex - Math.round((t.clientX - n.startX) / n.step), 0, e.length - 1));
	}, E = (t, n = !1) => {
		let r = p.current;
		if (r?.pointerId !== t.pointerId) return;
		let i = n ? 0 : t.clientX - r.startX, a = n ? 0 : i + r.velocity * 240, o = h(r.startIndex - Math.round(a / r.step), 0, e.length - 1);
		m.current = Math.abs(i) > 8 || o !== r.startIndex, m.current && window.setTimeout(() => {
			m.current = !1;
		}, 0), n || x(o), l(!1), p.current = null, t.currentTarget.hasPointerCapture(t.pointerId) && t.currentTarget.releasePointerCapture(t.pointerId);
	};
	return /* @__PURE__ */ f("section", {
		className: "project-grid cover-flow",
		"aria-label": "Project cover flow",
		children: [/* @__PURE__ */ f("div", {
			className: `cover-flow__stage${c ? " is-dragging" : ""}`,
			role: "region",
			"aria-roledescription": "Cover flow",
			"aria-label": "Project covers. Drag horizontally to browse quickly, or use left and right arrow keys.",
			tabIndex: "0",
			onKeyDown: C,
			onPointerDown: w,
			onPointerMove: T,
			onPointerUp: E,
			onPointerCancel: (e) => E(e, !0),
			children: [/* @__PURE__ */ d(y, { lines: u }), e.map((t, n) => {
				let r = n - _, i = Math.abs(r), a = r === 0 ? 0 : r > 0 ? -68 : 68, o = {
					transform: `translate(-50%, -50%) translateX(${Math.sign(r) * 198 * (1 - (2 / 3) ** i)}%) translateZ(${-i * 5.5}rem) rotateY(${a}deg) scale(${Math.max(.7, 1 - i * .07)})`,
					zIndex: e.length - i
				};
				return /* @__PURE__ */ f("button", {
					className: "cover-flow__item",
					type: "button",
					"aria-label": `Select ${t.title}`,
					"aria-pressed": n === _,
					onClick: (e) => {
						if (m.current) {
							e.preventDefault(), m.current = !1;
							return;
						}
						x(n);
					},
					style: o,
					tabIndex: i > 3 ? -1 : 0,
					children: [
						/* @__PURE__ */ d("img", {
							src: t.image,
							alt: "",
							draggable: "false"
						}),
						/* @__PURE__ */ d("span", {
							className: "cover-flow__reflection",
							"aria-hidden": "true",
							children: /* @__PURE__ */ d("img", {
								src: t.image,
								alt: "",
								draggable: "false"
							})
						}),
						/* @__PURE__ */ d("span", {
							className: "cover-flow__item-index",
							children: String(n + 2).padStart(2, "0")
						})
					]
				}, t.title);
			})]
		}), /* @__PURE__ */ d("div", {
			className: "cover-flow__caption",
			"aria-live": "polite",
			children: /* @__PURE__ */ f("article", {
				className: "project-postcard",
				"data-direction": r,
				children: [/* @__PURE__ */ f("div", {
					className: "project-postcard__image-panel",
					children: [
						/* @__PURE__ */ d("img", {
							src: b.image,
							alt: "",
							draggable: "false"
						}),
						/* @__PURE__ */ f("span", {
							className: "project-postcard__edition",
							children: ["FYUO", /* @__PURE__ */ d("sub", { children: "863" })]
						}),
						/* @__PURE__ */ f("span", {
							className: "project-postcard__serial",
							children: [
								String(_ + 2).padStart(2, "0"),
								" / ",
								String(e.length + 1).padStart(2, "0")
							]
						})
					]
				}), /* @__PURE__ */ f("div", {
					className: "project-postcard__message-panel",
					children: [
						/* @__PURE__ */ f("header", {
							className: "project-postcard__header",
							children: [/* @__PURE__ */ d("p", { children: "Project correspondence" }), /* @__PURE__ */ d("span", {
								"aria-hidden": "true",
								children: "Selected work."
							})]
						}),
						/* @__PURE__ */ f("div", {
							className: "project-postcard__copy",
							children: [
								/* @__PURE__ */ d("h3", {
									className: "cover-flow__title",
									children: b.title
								}),
								/* @__PURE__ */ d("p", {
									className: "cover-flow__description",
									children: b.description
								}),
								b.linkUrl && /* @__PURE__ */ d("a", {
									className: "cover-flow__open",
									href: b.linkUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									children: "open project ↗"
								})
							]
						}),
						/* @__PURE__ */ f("footer", {
							className: "project-postcard__footer",
							children: [/* @__PURE__ */ f("p", {
								className: "cover-flow__index",
								children: ["Archive ", String(_ + 2).padStart(2, "0")]
							}), /* @__PURE__ */ f("div", {
								className: "cover-flow__controls",
								"aria-label": "Project navigation",
								children: [/* @__PURE__ */ d("button", {
									className: "cover-flow__button",
									type: "button",
									onClick: () => S(-1),
									"aria-label": "Previous project",
									disabled: _ === 0,
									children: "←"
								}), /* @__PURE__ */ d("button", {
									className: "cover-flow__button",
									type: "button",
									onClick: () => S(1),
									"aria-label": "Next project",
									disabled: _ === e.length - 1,
									children: "→"
								})]
							})]
						})
					]
				})]
			}, `${_}-${r}`)
		})]
	});
}
//#endregion
//#region src/components/HalftoneTitle.jsx
function x({ id: e, children: t }) {
	let n = o(null), r = o(null), c = i.toArray(t).map((e) => typeof e == "string" ? e : String(e.props?.children ?? "")), l = c.join("").replace(/\s/g, "").length, [u, p] = s(0);
	a(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || l < 2) return;
		let e = window.setInterval(() => {
			p((e) => (e + 1) % l);
		}, 500);
		return () => window.clearInterval(e);
	}, [l]), a(() => {
		let e = n.current, t = r.current, i = t?.getContext("2d"), a = e?.closest(".home-cover");
		if (!e || !t || !i || !a) return;
		let o = getComputedStyle(document.documentElement), s = {
			paper: o.getPropertyValue("--color-paper").trim(),
			cobalt: o.getPropertyValue("--color-cobalt").trim()
		}, c = Number.parseFloat(o.getPropertyValue("--halftone-cell-size")) || 18, l = Number.parseFloat(o.getPropertyValue("--halftone-base-radius")) || .78, u = Number.parseFloat(o.getPropertyValue("--halftone-title-dot-scale")) || .5, d = Number.parseFloat(o.getPropertyValue("--halftone-reveal-radius")) || 180, f = Number.parseFloat(o.getPropertyValue("--halftone-wave-interval-min")) || 460, p = Number.parseFloat(o.getPropertyValue("--halftone-wave-interval-max")) || 1540, m = Number.parseFloat(o.getPropertyValue("--halftone-wave-speed")) || .14, h = Number.parseFloat(o.getPropertyValue("--halftone-wave-damping")) || .992, g = Number.parseFloat(o.getPropertyValue("--halftone-wave-strength")) || 1.65, _ = {
			width: 0,
			height: 0,
			titleBounds: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			points: [],
			pointer: {
				x: 0,
				y: 0,
				clientX: 0,
				clientY: 0,
				active: !1
			},
			visible: !0,
			frame: 0,
			animation: 0,
			lastFrame: 0,
			wave: null
		}, v = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, y = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches && !v(), b = (e, t) => {
			let n = a.getBoundingClientRect();
			_.pointer = {
				x: e - n.left,
				y: t - n.top,
				clientX: e,
				clientY: t,
				active: !0
			};
		}, x = (e, t, n = g) => {
			let r = _.wave;
			if (!r) return;
			let i = Math.max(1, Math.min(r.columns - 2, Math.round((e - c / 2) / c) + 1)), a = Math.max(1, Math.min(r.rows - 2, Math.round((t - c / 2) / c) + 1));
			for (let e = Math.max(1, a - 3); e <= Math.min(r.rows - 2, a + 3); e += 1) for (let t = Math.max(1, i - 3); t <= Math.min(r.columns - 2, i + 3); t += 1) {
				let o = Math.hypot(t - i, e - a);
				o > 3.5 || (r.current[e * r.columns + t] -= (1 - o / 3.5) * n);
			}
		}, S = (e) => {
			let t = _.wave;
			if (!t || e < t.nextImpulse) return;
			t.lastImpulse = e, t.nextImpulse = e + f + Math.random() * (p - f);
			let n = 2 + Math.round((Math.sin(e / 620) + 1) / 2 * (t.rows - 5));
			x(c / 2, n * c - c / 2);
		}, C = (e) => {
			let t = _.wave;
			if (t) {
				S(e);
				for (let e = 1; e < t.rows - 1; e += 1) for (let n = 1; n < t.columns - 1; n += 1) {
					let r = e * t.columns + n, i = t.current[r - 1] + t.current[r + 1] + t.current[r - t.columns] + t.current[r + t.columns] - 4 * t.current[r], a = Math.min(e, n, t.rows - 1 - e, t.columns - 1 - n), o = a < 4 ? .94 + a * .014 : 1;
					t.next[r] = (2 * t.current[r] - t.previous[r] + i * m) * h * o;
				}
				[t.previous, t.current, t.next] = [
					t.current,
					t.next,
					t.previous
				], t.next.fill(0);
			}
		}, w = () => {
			!_.width || !_.height || (i.clearRect(0, 0, _.width, _.height), i.fillStyle = s.cobalt, i.fillRect(0, 0, _.width, _.height), i.fillStyle = s.paper, _.points.forEach((e) => {
				let t = Math.hypot(e.x - _.pointer.x, e.y - _.pointer.y), n = _.pointer.active ? Math.max(0, 1 - t / d) : 0, r = n * n * (3 - 2 * n), a = _.wave?.current[e.waveIndex] || 0, o = c * Math.max(.12, Math.min(.96, e.baseRadius - r * .63 + a * .27));
				i.beginPath(), i.arc(e.x, e.y, o, 0, Math.PI * 2), i.fill();
			}));
		}, T = () => {
			let n = a.getBoundingClientRect(), r = e.getBoundingClientRect(), o = Math.min(window.devicePixelRatio || 1, 1.5);
			_.width = Math.max(1, n.width), _.height = Math.max(1, n.height), _.titleBounds = {
				x: r.left - n.left,
				y: r.top - n.top,
				width: r.width,
				height: r.height
			}, _.pointer.active && b(_.pointer.clientX, _.pointer.clientY), t.width = Math.round(_.width * o), t.height = Math.round(_.height * o), i.setTransform(o, 0, 0, o, 0, 0), _.points = [];
			let s = Math.ceil(_.width / c) + 2, d = Math.ceil(_.height / c) + 2;
			_.wave = {
				columns: s,
				rows: d,
				previous: new Float32Array(s * d),
				current: new Float32Array(s * d),
				next: new Float32Array(s * d),
				lastImpulse: -Infinity,
				nextImpulse: 0
			};
			for (let e = c / 2; e < _.height + c; e += c) {
				let t = Math.max(1, Math.min(d - 2, Math.round((e - c / 2) / c) + 1));
				for (let n = c / 2; n < _.width + c; n += c) {
					let r = n >= _.titleBounds.x && n <= _.titleBounds.x + _.titleBounds.width && e >= _.titleBounds.y && e <= _.titleBounds.y + _.titleBounds.height, i = Math.max(1, Math.min(s - 2, Math.round((n - c / 2) / c) + 1));
					_.points.push({
						x: n,
						y: e,
						baseRadius: l * (r ? u : 1),
						waveIndex: t * s + i
					});
				}
			}
			w();
		}, E = () => {
			_.frame || !_.visible || (_.frame = window.requestAnimationFrame(() => {
				_.frame = 0, w();
			}));
		}, D = (e) => {
			y() && (b(e.clientX, e.clientY), E());
		}, O = () => {
			_.pointer.active && (b(_.pointer.clientX, _.pointer.clientY), E());
		}, k = () => {
			_.pointer.active = !1, E();
		}, A = (e) => {
			if (v()) return;
			let t = a.getBoundingClientRect();
			x(e.clientX - t.left, e.clientY - t.top, g * 1.2), E();
		}, j = (e) => {
			if (!_.visible || v()) {
				_.animation = 0;
				return;
			}
			_.lastFrame && C(e), _.lastFrame = e, w(), _.animation = window.requestAnimationFrame(j);
		}, M = () => {
			!_.animation && _.visible && !v() && (_.lastFrame = 0, _.animation = window.requestAnimationFrame(j));
		}, N = new ResizeObserver(T), P = new IntersectionObserver(([e]) => {
			_.visible = e.isIntersecting, _.visible && (w(), M());
		}, { threshold: .01 });
		return N.observe(a), N.observe(e), P.observe(a), window.addEventListener("pointermove", D, { passive: !0 }), window.addEventListener("scroll", O, { passive: !0 }), window.addEventListener("blur", k), a.addEventListener("pointerdown", A, { passive: !0 }), T(), M(), () => {
			_.frame && window.cancelAnimationFrame(_.frame), _.animation && window.cancelAnimationFrame(_.animation), N.disconnect(), P.disconnect(), window.removeEventListener("pointermove", D), window.removeEventListener("scroll", O), window.removeEventListener("blur", k), a.removeEventListener("pointerdown", A);
		};
	}, []);
	let m = 0;
	return /* @__PURE__ */ f("h1", {
		className: "cover-title cover-title--halftone",
		id: e,
		ref: n,
		children: [/* @__PURE__ */ d("canvas", {
			ref: r,
			className: "halftone-title__canvas",
			"aria-hidden": "true"
		}), /* @__PURE__ */ d("span", {
			className: "cover-title__text",
			children: c.map((e, t) => /* @__PURE__ */ d("span", {
				className: "cover-title__line",
				children: Array.from(e).map((e, t) => /* @__PURE__ */ d("span", {
					className: `halftone-title__character${(e.trim() ? m++ : -1) === u ? " is-selected" : ""}`,
					children: e || "\xA0"
				}, `${e}-${t}`))
			}, `${e}-${t}`))
		})]
	});
}
//#endregion
//#region src/physics/PhysicsItem.jsx
function S({ children: e, className: t = "", strength: n = 1 }) {
	return /* @__PURE__ */ d("div", {
		className: t,
		"data-physics-item": "true",
		"data-physics-strength": n,
		children: e
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/bind.js
function C(e, t) {
	return function() {
		return e.apply(t, arguments);
	};
}
//#endregion
//#region node_modules/axios/lib/utils.js
var { toString: w } = Object.prototype, { getPrototypeOf: T } = Object, { iterator: E, toStringTag: D } = Symbol, O = ((e) => (t) => {
	let n = w.call(t);
	return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(Object.create(null)), k = (e) => (e = e.toLowerCase(), (t) => O(t) === e), A = (e) => (t) => typeof t === e, { isArray: j } = Array, M = A("undefined");
function N(e) {
	return e !== null && !M(e) && e.constructor !== null && !M(e.constructor) && F(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
var P = k("ArrayBuffer");
function ee(e) {
	let t;
	return t = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && P(e.buffer), t;
}
var te = A("string"), F = A("function"), ne = A("number"), I = (e) => typeof e == "object" && !!e, re = (e) => e === !0 || e === !1, L = (e) => {
	if (O(e) !== "object") return !1;
	let t = T(e);
	return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(D in e) && !(E in e);
}, ie = (e) => {
	if (!I(e) || N(e)) return !1;
	try {
		return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
	} catch {
		return !1;
	}
}, ae = k("Date"), oe = k("File"), se = (e) => !!(e && e.uri !== void 0), ce = (e) => e && e.getParts !== void 0, le = k("Blob"), ue = k("FileList"), de = (e) => I(e) && F(e.pipe);
function fe() {
	return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
var pe = fe(), me = pe.FormData === void 0 ? void 0 : pe.FormData, he = (e) => {
	if (!e) return !1;
	if (me && e instanceof me) return !0;
	let t = T(e);
	if (!t || t === Object.prototype || !F(e.append)) return !1;
	let n = O(e);
	return n === "formdata" || n === "object" && F(e.toString) && e.toString() === "[object FormData]";
}, ge = k("URLSearchParams"), [_e, ve, ye, be] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(k), xe = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function R(e, t, { allOwnKeys: n = !1 } = {}) {
	if (e == null) return;
	let r, i;
	if (typeof e != "object" && (e = [e]), j(e)) for (r = 0, i = e.length; r < i; r++) t.call(null, e[r], r, e);
	else {
		if (N(e)) return;
		let i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length, o;
		for (r = 0; r < a; r++) o = i[r], t.call(null, e[o], o, e);
	}
}
function Se(e, t) {
	if (N(e)) return null;
	t = t.toLowerCase();
	let n = Object.keys(e), r = n.length, i;
	for (; r-- > 0;) if (i = n[r], t === i.toLowerCase()) return i;
	return null;
}
var z = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Ce = (e) => !M(e) && e !== z;
function we(...e) {
	let { caseless: t, skipUndefined: n } = Ce(this) && this || {}, r = {}, i = (e, i) => {
		if (i === "__proto__" || i === "constructor" || i === "prototype") return;
		let a = t && Se(r, i) || i, o = Ie(r, a) ? r[a] : void 0;
		L(o) && L(e) ? r[a] = we(o, e) : L(e) ? r[a] = we({}, e) : j(e) ? r[a] = e.slice() : (!n || !M(e)) && (r[a] = e);
	};
	for (let t = 0, n = e.length; t < n; t++) e[t] && R(e[t], i);
	return r;
}
var Te = (e, t, n, { allOwnKeys: r } = {}) => (R(t, (t, r) => {
	n && F(t) ? Object.defineProperty(e, r, {
		__proto__: null,
		value: C(t, n),
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
}, { allOwnKeys: r }), e), Ee = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), De = (e, t, n, r) => {
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
}, Oe = (e, t, n, r) => {
	let i, a, o, s = {};
	if (t ||= {}, e == null) return t;
	do {
		for (i = Object.getOwnPropertyNames(e), a = i.length; a-- > 0;) o = i[a], (!r || r(o, e, t)) && !s[o] && (t[o] = e[o], s[o] = !0);
		e = n !== !1 && T(e);
	} while (e && (!n || n(e, t)) && e !== Object.prototype);
	return t;
}, ke = (e, t, n) => {
	e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
	let r = e.indexOf(t, n);
	return r !== -1 && r === n;
}, Ae = (e) => {
	if (!e) return null;
	if (j(e)) return e;
	let t = e.length;
	if (!ne(t)) return null;
	let n = Array(t);
	for (; t-- > 0;) n[t] = e[t];
	return n;
}, je = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && T(Uint8Array)), Me = (e, t) => {
	let n = (e && e[E]).call(e), r;
	for (; (r = n.next()) && !r.done;) {
		let n = r.value;
		t.call(e, n[0], n[1]);
	}
}, Ne = (e, t) => {
	let n, r = [];
	for (; (n = e.exec(t)) !== null;) r.push(n);
	return r;
}, Pe = k("HTMLFormElement"), Fe = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(e, t, n) {
	return t.toUpperCase() + n;
}), Ie = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), Le = k("RegExp"), Re = (e, t) => {
	let n = Object.getOwnPropertyDescriptors(e), r = {};
	R(n, (n, i) => {
		let a;
		(a = t(n, i, e)) !== !1 && (r[i] = a || n);
	}), Object.defineProperties(e, r);
}, ze = (e) => {
	Re(e, (t, n) => {
		if (F(e) && [
			"arguments",
			"caller",
			"callee"
		].includes(n)) return !1;
		let r = e[n];
		if (F(r)) {
			if (t.enumerable = !1, "writable" in t) {
				t.writable = !1;
				return;
			}
			t.set ||= () => {
				throw Error("Can not rewrite read-only method '" + n + "'");
			};
		}
	});
}, Be = (e, t) => {
	let n = {}, r = (e) => {
		e.forEach((e) => {
			n[e] = !0;
		});
	};
	return j(e) ? r(e) : r(String(e).split(t)), n;
}, Ve = () => {}, He = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function Ue(e) {
	return !!(e && F(e.append) && e[D] === "FormData" && e[E]);
}
var We = (e) => {
	let t = /* @__PURE__ */ new WeakSet(), n = (e) => {
		if (I(e)) {
			if (t.has(e)) return;
			if (N(e)) return e;
			if (!("toJSON" in e)) {
				t.add(e);
				let r = j(e) ? [] : {};
				return R(e, (e, t) => {
					let i = n(e);
					!M(i) && (r[t] = i);
				}), t.delete(e), r;
			}
		}
		return e;
	};
	return n(e);
}, Ge = k("AsyncFunction"), Ke = (e) => e && (I(e) || F(e)) && F(e.then) && F(e.catch), qe = ((e, t) => e ? setImmediate : t ? ((e, t) => (z.addEventListener("message", ({ source: n, data: r }) => {
	n === z && r === e && t.length && t.shift()();
}, !1), (n) => {
	t.push(n), z.postMessage(e, "*");
}))(`axios@${Math.random()}`, []) : (e) => setTimeout(e))(typeof setImmediate == "function", F(z.postMessage)), B = {
	isArray: j,
	isArrayBuffer: P,
	isBuffer: N,
	isFormData: he,
	isArrayBufferView: ee,
	isString: te,
	isNumber: ne,
	isBoolean: re,
	isObject: I,
	isPlainObject: L,
	isEmptyObject: ie,
	isReadableStream: _e,
	isRequest: ve,
	isResponse: ye,
	isHeaders: be,
	isUndefined: M,
	isDate: ae,
	isFile: oe,
	isReactNativeBlob: se,
	isReactNative: ce,
	isBlob: le,
	isRegExp: Le,
	isFunction: F,
	isStream: de,
	isURLSearchParams: ge,
	isTypedArray: je,
	isFileList: ue,
	forEach: R,
	merge: we,
	extend: Te,
	trim: xe,
	stripBOM: Ee,
	inherits: De,
	toFlatObject: Oe,
	kindOf: O,
	kindOfTest: k,
	endsWith: ke,
	toArray: Ae,
	forEachEntry: Me,
	matchAll: Ne,
	isHTMLForm: Pe,
	hasOwnProperty: Ie,
	hasOwnProp: Ie,
	reduceDescriptors: Re,
	freezeMethods: ze,
	toObjectSet: Be,
	toCamelCase: Fe,
	noop: Ve,
	toFiniteNumber: He,
	findKey: Se,
	global: z,
	isContextDefined: Ce,
	isSpecCompliantForm: Ue,
	toJSONObject: We,
	isAsyncFn: Ge,
	isThenable: Ke,
	setImmediate: qe,
	asap: typeof queueMicrotask < "u" ? queueMicrotask.bind(z) : typeof process < "u" && process.nextTick || qe,
	isIterable: (e) => e != null && F(e[E])
}, Je = B.toObjectSet([
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
]), Ye = (e) => {
	let t = {}, n, r, i;
	return e && e.split("\n").forEach(function(e) {
		i = e.indexOf(":"), n = e.substring(0, i).trim().toLowerCase(), r = e.substring(i + 1).trim(), !(!n || t[n] && Je[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
	}), t;
};
//#endregion
//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
function Xe(e) {
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
var Ze = /* @__PURE__ */ RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), Qe = /* @__PURE__ */ RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function $e(e, t) {
	return B.isArray(e) ? e.map((e) => $e(e, t)) : Xe(String(e).replace(t, ""));
}
var et = (e) => $e(e, Ze), tt = (e) => $e(e, Qe);
function nt(e) {
	let t = Object.create(null);
	return B.forEach(e.toJSON(), (e, n) => {
		t[n] = tt(e);
	}), t;
}
//#endregion
//#region node_modules/axios/lib/core/AxiosHeaders.js
var rt = Symbol("internals");
function V(e) {
	return e && String(e).trim().toLowerCase();
}
function H(e) {
	return e === !1 || e == null ? e : B.isArray(e) ? e.map(H) : et(String(e));
}
function it(e) {
	let t = Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g, r;
	for (; r = n.exec(e);) t[r[1]] = r[2];
	return t;
}
var at = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function ot(e, t, n, r, i) {
	if (B.isFunction(r)) return r.call(this, t, n);
	if (i && (t = n), B.isString(t)) {
		if (B.isString(r)) return t.indexOf(r) !== -1;
		if (B.isRegExp(r)) return r.test(t);
	}
}
function st(e) {
	return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
}
function ct(e, t) {
	let n = B.toCamelCase(" " + t);
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
var U = class {
	constructor(e) {
		e && this.set(e);
	}
	set(e, t, n) {
		let r = this;
		function i(e, t, n) {
			let i = V(t);
			if (!i) throw Error("header name must be a non-empty string");
			let a = B.findKey(r, i);
			(!a || r[a] === void 0 || n === !0 || n === void 0 && r[a] !== !1) && (r[a || t] = H(e));
		}
		let a = (e, t) => B.forEach(e, (e, n) => i(e, n, t));
		if (B.isPlainObject(e) || e instanceof this.constructor) a(e, t);
		else if (B.isString(e) && (e = e.trim()) && !at(e)) a(Ye(e), t);
		else if (B.isObject(e) && B.isIterable(e)) {
			let n = {}, r, i;
			for (let t of e) {
				if (!B.isArray(t)) throw TypeError("Object iterator must return a key-value pair");
				n[i = t[0]] = (r = n[i]) ? B.isArray(r) ? [...r, t[1]] : [r, t[1]] : t[1];
			}
			a(n, t);
		} else e != null && i(t, e, n);
		return this;
	}
	get(e, t) {
		if (e = V(e), e) {
			let n = B.findKey(this, e);
			if (n) {
				let e = this[n];
				if (!t) return e;
				if (t === !0) return it(e);
				if (B.isFunction(t)) return t.call(this, e, n);
				if (B.isRegExp(t)) return t.exec(e);
				throw TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(e, t) {
		if (e = V(e), e) {
			let n = B.findKey(this, e);
			return !!(n && this[n] !== void 0 && (!t || ot(this, this[n], n, t)));
		}
		return !1;
	}
	delete(e, t) {
		let n = this, r = !1;
		function i(e) {
			if (e = V(e), e) {
				let i = B.findKey(n, e);
				i && (!t || ot(n, n[i], i, t)) && (delete n[i], r = !0);
			}
		}
		return B.isArray(e) ? e.forEach(i) : i(e), r;
	}
	clear(e) {
		let t = Object.keys(this), n = t.length, r = !1;
		for (; n--;) {
			let i = t[n];
			(!e || ot(this, this[i], i, e, !0)) && (delete this[i], r = !0);
		}
		return r;
	}
	normalize(e) {
		let t = this, n = {};
		return B.forEach(this, (r, i) => {
			let a = B.findKey(n, i);
			if (a) {
				t[a] = H(r), delete t[i];
				return;
			}
			let o = e ? st(i) : String(i).trim();
			o !== i && delete t[i], t[o] = H(r), n[o] = !0;
		}), this;
	}
	concat(...e) {
		return this.constructor.concat(this, ...e);
	}
	toJSON(e) {
		let t = Object.create(null);
		return B.forEach(this, (n, r) => {
			n != null && n !== !1 && (t[r] = e && B.isArray(n) ? n.join(", ") : n);
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
		let t = (this[rt] = this[rt] = { accessors: {} }).accessors, n = this.prototype;
		function r(e) {
			let r = V(e);
			t[r] || (ct(n, e), t[r] = !0);
		}
		return B.isArray(e) ? e.forEach(r) : r(e), this;
	}
};
U.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]), B.reduceDescriptors(U.prototype, ({ value: e }, t) => {
	let n = t[0].toUpperCase() + t.slice(1);
	return {
		get: () => e,
		set(e) {
			this[n] = e;
		}
	};
}), B.freezeMethods(U);
//#endregion
//#region node_modules/axios/lib/core/AxiosError.js
var lt = "[REDACTED ****]";
function ut(e) {
	if (B.hasOwnProp(e, "toJSON")) return !0;
	let t = Object.getPrototypeOf(e);
	for (; t && t !== Object.prototype;) {
		if (B.hasOwnProp(t, "toJSON")) return !0;
		t = Object.getPrototypeOf(t);
	}
	return !1;
}
function dt(e, t) {
	let n = new Set(t.map((e) => String(e).toLowerCase())), r = [], i = (e) => {
		if (typeof e != "object" || !e || B.isBuffer(e)) return e;
		if (r.indexOf(e) !== -1) return;
		e instanceof U && (e = e.toJSON()), r.push(e);
		let t;
		if (B.isArray(e)) t = [], e.forEach((e, n) => {
			let r = i(e);
			B.isUndefined(r) || (t[n] = r);
		});
		else {
			if (!B.isPlainObject(e) && ut(e)) return r.pop(), e;
			t = Object.create(null);
			for (let [r, a] of Object.entries(e)) {
				let e = n.has(r.toLowerCase()) ? lt : i(a);
				B.isUndefined(e) || (t[r] = e);
			}
		}
		return r.pop(), t;
	};
	return i(e);
}
var W = class e extends Error {
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
		let e = this.config, t = e && B.hasOwnProp(e, "redact") ? e.redact : void 0, n = B.isArray(t) && t.length > 0 ? dt(e, t) : B.toJSONObject(e);
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
W.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE", W.ERR_BAD_OPTION = "ERR_BAD_OPTION", W.ECONNABORTED = "ECONNABORTED", W.ETIMEDOUT = "ETIMEDOUT", W.ECONNREFUSED = "ECONNREFUSED", W.ERR_NETWORK = "ERR_NETWORK", W.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS", W.ERR_DEPRECATED = "ERR_DEPRECATED", W.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE", W.ERR_BAD_REQUEST = "ERR_BAD_REQUEST", W.ERR_CANCELED = "ERR_CANCELED", W.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT", W.ERR_INVALID_URL = "ERR_INVALID_URL", W.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
//#endregion
//#region node_modules/axios/lib/helpers/toFormData.js
function ft(e) {
	return B.isPlainObject(e) || B.isArray(e);
}
function pt(e) {
	return B.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function mt(e, t, n) {
	return e ? e.concat(t).map(function(e, t) {
		return e = pt(e), !n && t ? "[" + e + "]" : e;
	}).join(n ? "." : "") : t;
}
function ht(e) {
	return B.isArray(e) && !e.some(ft);
}
var gt = B.toFlatObject(B, {}, null, function(e) {
	return /^is[A-Z]/.test(e);
});
function _t(e, t, n) {
	if (!B.isObject(e)) throw TypeError("target must be an object");
	t ||= new FormData(), n = B.toFlatObject(n, {
		metaTokens: !0,
		dots: !1,
		indexes: !1
	}, !1, function(e, t) {
		return !B.isUndefined(t[e]);
	});
	let r = n.metaTokens, i = n.visitor || d, a = n.dots, o = n.indexes, s = n.Blob || typeof Blob < "u" && Blob, c = n.maxDepth === void 0 ? 100 : n.maxDepth, l = s && B.isSpecCompliantForm(t);
	if (!B.isFunction(i)) throw TypeError("visitor must be a function");
	function u(e) {
		if (e === null) return "";
		if (B.isDate(e)) return e.toISOString();
		if (B.isBoolean(e)) return e.toString();
		if (!l && B.isBlob(e)) throw new W("Blob is not supported. Use a Buffer instead.");
		return B.isArrayBuffer(e) || B.isTypedArray(e) ? l && typeof Blob == "function" ? new Blob([e]) : Buffer.from(e) : e;
	}
	function d(e, n, i) {
		let s = e;
		if (B.isReactNative(t) && B.isReactNativeBlob(e)) return t.append(mt(i, n, a), u(e)), !1;
		if (e && !i && typeof e == "object") {
			if (B.endsWith(n, "{}")) n = r ? n : n.slice(0, -2), e = JSON.stringify(e);
			else if (B.isArray(e) && ht(e) || (B.isFileList(e) || B.endsWith(n, "[]")) && (s = B.toArray(e))) return n = pt(n), s.forEach(function(e, r) {
				!(B.isUndefined(e) || e === null) && t.append(o === !0 ? mt([n], r, a) : o === null ? n : n + "[]", u(e));
			}), !1;
		}
		return ft(e) ? !0 : (t.append(mt(i, n, a), u(e)), !1);
	}
	let f = [], p = Object.assign(gt, {
		defaultVisitor: d,
		convertValue: u,
		isVisitable: ft
	});
	function m(e, n, r = 0) {
		if (!B.isUndefined(e)) {
			if (r > c) throw new W("Object is too deeply nested (" + r + " levels). Max depth: " + c, W.ERR_FORM_DATA_DEPTH_EXCEEDED);
			if (f.indexOf(e) !== -1) throw Error("Circular reference detected in " + n.join("."));
			f.push(e), B.forEach(e, function(e, a) {
				(!(B.isUndefined(e) || e === null) && i.call(t, e, B.isString(a) ? a.trim() : a, n, p)) === !0 && m(e, n ? n.concat(a) : [a], r + 1);
			}), f.pop();
		}
	}
	if (!B.isObject(e)) throw TypeError("data must be an object");
	return m(e), t;
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function vt(e) {
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
function yt(e, t) {
	this._pairs = [], e && _t(e, this, t);
}
var bt = yt.prototype;
bt.append = function(e, t) {
	this._pairs.push([e, t]);
}, bt.toString = function(e) {
	let t = e ? function(t) {
		return e.call(this, t, vt);
	} : vt;
	return this._pairs.map(function(e) {
		return t(e[0]) + "=" + t(e[1]);
	}, "").join("&");
};
//#endregion
//#region node_modules/axios/lib/helpers/buildURL.js
function xt(e) {
	return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function St(e, t, n) {
	if (!t) return e;
	let r = n && n.encode || xt, i = B.isFunction(n) ? { serialize: n } : n, a = i && i.serialize, o;
	if (o = a ? a(t, i) : B.isURLSearchParams(t) ? t.toString() : new yt(t, i).toString(r), o) {
		let t = e.indexOf("#");
		t !== -1 && (e = e.slice(0, t)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
	}
	return e;
}
//#endregion
//#region node_modules/axios/lib/core/InterceptorManager.js
var Ct = class {
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
		B.forEach(this.handlers, function(t) {
			t !== null && e(t);
		});
	}
}, wt = {
	silentJSONParsing: !0,
	forcedJSONParsing: !0,
	clarifyTimeoutError: !1,
	legacyInterceptorReqResOrdering: !0
}, Tt = {
	isBrowser: !0,
	classes: {
		URLSearchParams: typeof URLSearchParams < "u" ? URLSearchParams : yt,
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
}, Et = /* @__PURE__ */ t({
	hasBrowserEnv: () => Dt,
	hasStandardBrowserEnv: () => kt,
	hasStandardBrowserWebWorkerEnv: () => At,
	navigator: () => Ot,
	origin: () => jt
}), Dt = typeof window < "u" && typeof document < "u", Ot = typeof navigator == "object" && navigator || void 0, kt = Dt && (!Ot || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(Ot.product) < 0), At = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function", jt = Dt && window.location.href || "http://localhost", G = {
	...Et,
	...Tt
};
//#endregion
//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
function Mt(e, t) {
	return _t(e, new G.classes.URLSearchParams(), {
		visitor: function(e, t, n, r) {
			return G.isNode && B.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : r.defaultVisitor.apply(this, arguments);
		},
		...t
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/formDataToJSON.js
function Nt(e) {
	return B.matchAll(/\w+|\[(\w*)]/g, e).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function Pt(e) {
	let t = {}, n = Object.keys(e), r, i = n.length, a;
	for (r = 0; r < i; r++) a = n[r], t[a] = e[a];
	return t;
}
function Ft(e) {
	function t(e, n, r, i) {
		let a = e[i++];
		if (a === "__proto__") return !0;
		let o = Number.isFinite(+a), s = i >= e.length;
		return a = !a && B.isArray(r) ? r.length : a, s ? (B.hasOwnProp(r, a) ? r[a] = B.isArray(r[a]) ? r[a].concat(n) : [r[a], n] : r[a] = n, !o) : ((!B.hasOwnProp(r, a) || !B.isObject(r[a])) && (r[a] = []), t(e, n, r[a], i) && B.isArray(r[a]) && (r[a] = Pt(r[a])), !o);
	}
	if (B.isFormData(e) && B.isFunction(e.entries)) {
		let n = {};
		return B.forEachEntry(e, (e, r) => {
			t(Nt(e), r, n, 0);
		}), n;
	}
	return null;
}
//#endregion
//#region node_modules/axios/lib/defaults/index.js
var K = (e, t) => e != null && B.hasOwnProp(e, t) ? e[t] : void 0;
function It(e, t, n) {
	if (B.isString(e)) try {
		return (t || JSON.parse)(e), B.trim(e);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (n || JSON.stringify)(e);
}
var q = {
	transitional: wt,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function(e, t) {
		let n = t.getContentType() || "", r = n.indexOf("application/json") > -1, i = B.isObject(e);
		if (i && B.isHTMLForm(e) && (e = new FormData(e)), B.isFormData(e)) return r ? JSON.stringify(Ft(e)) : e;
		if (B.isArrayBuffer(e) || B.isBuffer(e) || B.isStream(e) || B.isFile(e) || B.isBlob(e) || B.isReadableStream(e)) return e;
		if (B.isArrayBufferView(e)) return e.buffer;
		if (B.isURLSearchParams(e)) return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
		let a;
		if (i) {
			let t = K(this, "formSerializer");
			if (n.indexOf("application/x-www-form-urlencoded") > -1) return Mt(e, t).toString();
			if ((a = B.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
				let n = K(this, "env"), r = n && n.FormData;
				return _t(a ? { "files[]": e } : e, r && new r(), t);
			}
		}
		return i || r ? (t.setContentType("application/json", !1), It(e)) : e;
	}],
	transformResponse: [function(e) {
		let t = K(this, "transitional") || q.transitional, n = t && t.forcedJSONParsing, r = K(this, "responseType"), i = r === "json";
		if (B.isResponse(e) || B.isReadableStream(e)) return e;
		if (e && B.isString(e) && (n && !r || i)) {
			let n = !(t && t.silentJSONParsing) && i;
			try {
				return JSON.parse(e, K(this, "parseReviver"));
			} catch (e) {
				if (n) throw e.name === "SyntaxError" ? W.from(e, W.ERR_BAD_RESPONSE, this, null, K(this, "response")) : e;
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
		FormData: G.classes.FormData,
		Blob: G.classes.Blob
	},
	validateStatus: function(e) {
		return e >= 200 && e < 300;
	},
	headers: { common: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
B.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch",
	"query"
], (e) => {
	q.headers[e] = {};
});
//#endregion
//#region node_modules/axios/lib/core/transformData.js
function Lt(e, t) {
	let n = this || q, r = t || n, i = U.from(r.headers), a = r.data;
	return B.forEach(e, function(e) {
		a = e.call(n, a, i.normalize(), t ? t.status : void 0);
	}), i.normalize(), a;
}
//#endregion
//#region node_modules/axios/lib/cancel/isCancel.js
function Rt(e) {
	return !!(e && e.__CANCEL__);
}
//#endregion
//#region node_modules/axios/lib/cancel/CanceledError.js
var J = class extends W {
	constructor(e, t, n) {
		super(e ?? "canceled", W.ERR_CANCELED, t, n), this.name = "CanceledError", this.__CANCEL__ = !0;
	}
};
//#endregion
//#region node_modules/axios/lib/core/settle.js
function zt(e, t, n) {
	let r = n.config.validateStatus;
	!n.status || !r || r(n.status) ? e(n) : t(new W("Request failed with status code " + n.status, n.status >= 400 && n.status < 500 ? W.ERR_BAD_REQUEST : W.ERR_BAD_RESPONSE, n.config, n.request, n));
}
//#endregion
//#region node_modules/axios/lib/helpers/parseProtocol.js
function Bt(e) {
	let t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
	return t && t[1] || "";
}
//#endregion
//#region node_modules/axios/lib/helpers/speedometer.js
function Vt(e, t) {
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
function Ht(e, t) {
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
var Ut = (e, t, n = 3) => {
	let r = 0, i = Vt(50, 250);
	return Ht((n) => {
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
}, Wt = (e, t) => {
	let n = e != null;
	return [(r) => t[0]({
		lengthComputable: n,
		total: e,
		loaded: r
	}), t[1]];
}, Gt = (e) => (...t) => B.asap(() => e(...t)), Kt = G.hasStandardBrowserEnv ? ((e, t) => (n) => (n = new URL(n, G.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(new URL(G.origin), G.navigator && /(msie|trident)/i.test(G.navigator.userAgent)) : () => !0, qt = G.hasStandardBrowserEnv ? {
	write(e, t, n, r, i, a, o) {
		if (typeof document > "u") return;
		let s = [`${e}=${encodeURIComponent(t)}`];
		B.isNumber(n) && s.push(`expires=${new Date(n).toUTCString()}`), B.isString(r) && s.push(`path=${r}`), B.isString(i) && s.push(`domain=${i}`), a === !0 && s.push("secure"), B.isString(o) && s.push(`SameSite=${o}`), document.cookie = s.join("; ");
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
function Jt(e) {
	return typeof e == "string" ? /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e) : !1;
}
//#endregion
//#region node_modules/axios/lib/helpers/combineURLs.js
function Yt(e, t) {
	return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
//#endregion
//#region node_modules/axios/lib/core/buildFullPath.js
function Xt(e, t, n) {
	let r = !Jt(t);
	return e && (r || n === !1) ? Yt(e, t) : t;
}
//#endregion
//#region node_modules/axios/lib/core/mergeConfig.js
var Zt = (e) => e instanceof U ? { ...e } : e;
function Y(e, t) {
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
		return B.isPlainObject(e) && B.isPlainObject(t) ? B.merge.call({ caseless: r }, e, t) : B.isPlainObject(t) ? B.merge({}, t) : B.isArray(t) ? t.slice() : t;
	}
	function i(e, t, n, i) {
		if (!B.isUndefined(t)) return r(e, t, n, i);
		if (!B.isUndefined(e)) return r(void 0, e, n, i);
	}
	function a(e, t) {
		if (!B.isUndefined(t)) return r(void 0, t);
	}
	function o(e, t) {
		if (!B.isUndefined(t)) return r(void 0, t);
		if (!B.isUndefined(e)) return r(void 0, e);
	}
	function s(n, i, a) {
		if (B.hasOwnProp(t, a)) return r(n, i);
		if (B.hasOwnProp(e, a)) return r(void 0, n);
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
		headers: (e, t, n) => i(Zt(e), Zt(t), n, !0)
	};
	return B.forEach(Object.keys({
		...e,
		...t
	}), function(r) {
		if (r === "__proto__" || r === "constructor" || r === "prototype") return;
		let a = B.hasOwnProp(c, r) ? c[r] : i, o = a(B.hasOwnProp(e, r) ? e[r] : void 0, B.hasOwnProp(t, r) ? t[r] : void 0, r);
		B.isUndefined(o) && a !== s || (n[r] = o);
	}), n;
}
//#endregion
//#region node_modules/axios/lib/helpers/resolveConfig.js
var Qt = ["content-type", "content-length"];
function $t(e, t, n) {
	if (n !== "content-only") {
		e.set(t);
		return;
	}
	Object.entries(t).forEach(([t, n]) => {
		Qt.includes(t.toLowerCase()) && e.set(t, n);
	});
}
var en = (e) => encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (e, t) => String.fromCharCode(parseInt(t, 16))), tn = (e) => {
	let t = Y({}, e), n = (e) => B.hasOwnProp(t, e) ? t[e] : void 0, r = n("data"), i = n("withXSRFToken"), a = n("xsrfHeaderName"), o = n("xsrfCookieName"), s = n("headers"), c = n("auth"), l = n("baseURL"), u = n("allowAbsoluteUrls"), d = n("url");
	if (t.headers = s = U.from(s), t.url = St(Xt(l, d, u), e.params, e.paramsSerializer), c && s.set("Authorization", "Basic " + btoa((c.username || "") + ":" + (c.password ? en(c.password) : ""))), B.isFormData(r) && (G.hasStandardBrowserEnv || G.hasStandardBrowserWebWorkerEnv ? s.setContentType(void 0) : B.isFunction(r.getHeaders) && $t(s, r.getHeaders(), n("formDataHeaderPolicy"))), G.hasStandardBrowserEnv && (B.isFunction(i) && (i = i(t)), i === !0 || i == null && Kt(t.url))) {
		let e = a && o && qt.read(o);
		e && s.set(a, e);
	}
	return t;
}, nn = typeof XMLHttpRequest < "u" && function(e) {
	return new Promise(function(t, n) {
		let r = tn(e), i = r.data, a = U.from(r.headers).normalize(), { responseType: o, onUploadProgress: s, onDownloadProgress: c } = r, l, u, d, f, p;
		function m() {
			f && f(), p && p(), r.cancelToken && r.cancelToken.unsubscribe(l), r.signal && r.signal.removeEventListener("abort", l);
		}
		let h = new XMLHttpRequest();
		h.open(r.method.toUpperCase(), r.url, !0), h.timeout = r.timeout;
		function g() {
			if (!h) return;
			let r = U.from("getAllResponseHeaders" in h && h.getAllResponseHeaders());
			zt(function(e) {
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
			h &&= (n(new W("Request aborted", W.ECONNABORTED, e, h)), m(), null);
		}, h.onerror = function(t) {
			let r = new W(t && t.message ? t.message : "Network Error", W.ERR_NETWORK, e, h);
			r.event = t || null, n(r), m(), h = null;
		}, h.ontimeout = function() {
			let t = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded", i = r.transitional || wt;
			r.timeoutErrorMessage && (t = r.timeoutErrorMessage), n(new W(t, i.clarifyTimeoutError ? W.ETIMEDOUT : W.ECONNABORTED, e, h)), m(), h = null;
		}, i === void 0 && a.setContentType(null), "setRequestHeader" in h && B.forEach(nt(a), function(e, t) {
			h.setRequestHeader(t, e);
		}), B.isUndefined(r.withCredentials) || (h.withCredentials = !!r.withCredentials), o && o !== "json" && (h.responseType = r.responseType), c && ([d, p] = Ut(c, !0), h.addEventListener("progress", d)), s && h.upload && ([u, f] = Ut(s), h.upload.addEventListener("progress", u), h.upload.addEventListener("loadend", f)), (r.cancelToken || r.signal) && (l = (t) => {
			h &&= (n(!t || t.type ? new J(null, e, h) : t), h.abort(), m(), null);
		}, r.cancelToken && r.cancelToken.subscribe(l), r.signal && (r.signal.aborted ? l() : r.signal.addEventListener("abort", l)));
		let _ = Bt(r.url);
		if (_ && !G.protocols.includes(_)) {
			n(new W("Unsupported protocol " + _ + ":", W.ERR_BAD_REQUEST, e));
			return;
		}
		h.send(i || null);
	});
}, rn = (e, t) => {
	if (e = e ? e.filter(Boolean) : [], !t && !e.length) return;
	let n = new AbortController(), r = !1, i = function(e) {
		if (!r) {
			r = !0, o();
			let t = e instanceof Error ? e : this.reason;
			n.abort(t instanceof W ? t : new J(t instanceof Error ? t.message : t));
		}
	}, a = t && setTimeout(() => {
		a = null, i(new W(`timeout of ${t}ms exceeded`, W.ETIMEDOUT));
	}, t), o = () => {
		e &&= (a && clearTimeout(a), a = null, e.forEach((e) => {
			e.unsubscribe ? e.unsubscribe(i) : e.removeEventListener("abort", i);
		}), null);
	};
	e.forEach((e) => e.addEventListener("abort", i));
	let { signal: s } = n;
	return s.unsubscribe = () => B.asap(o), s;
}, an = function* (e, t) {
	let n = e.byteLength;
	if (!t || n < t) {
		yield e;
		return;
	}
	let r = 0, i;
	for (; r < n;) i = r + t, yield e.slice(r, i), r = i;
}, on = async function* (e, t) {
	for await (let n of sn(e)) yield* an(n, t);
}, sn = async function* (e) {
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
}, cn = (e, t, n, r) => {
	let i = on(e, t), a = 0, o, s = (e) => {
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
function ln(e) {
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
var un = "1.16.1", dn = 64 * 1024, { isFunction: fn } = B, pn = (e, ...t) => {
	try {
		return !!e(...t);
	} catch {
		return !1;
	}
}, mn = (e) => {
	let t = B.global !== void 0 && B.global !== null ? B.global : globalThis, { ReadableStream: n, TextEncoder: r } = t;
	e = B.merge.call({ skipUndefined: !0 }, {
		Request: t.Request,
		Response: t.Response
	}, e);
	let { fetch: i, Request: a, Response: o } = e, s = i ? fn(i) : typeof fetch == "function", c = fn(a), l = fn(o);
	if (!s) return !1;
	let u = s && fn(n), d = s && (typeof r == "function" ? ((e) => (t) => e.encode(t))(new r()) : async (e) => new Uint8Array(await new a(e).arrayBuffer())), f = c && u && pn(() => {
		let e = !1, t = new a(G.origin, {
			body: new n(),
			method: "POST",
			get duplex() {
				return e = !0, "half";
			}
		}), r = t.headers.has("Content-Type");
		return t.body != null && t.body.cancel(), e && !r;
	}), p = l && u && pn(() => B.isReadableStream(new o("").body)), m = { stream: p && ((e) => e.body) };
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
			throw new W(`Response type '${e}' is not supported`, W.ERR_NOT_SUPPORT, n);
		});
	});
	let h = async (e) => {
		if (e == null) return 0;
		if (B.isBlob(e)) return e.size;
		if (B.isSpecCompliantForm(e)) return (await new a(G.origin, {
			method: "POST",
			body: e
		}).arrayBuffer()).byteLength;
		if (B.isArrayBufferView(e) || B.isArrayBuffer(e)) return e.byteLength;
		if (B.isURLSearchParams(e) && (e += ""), B.isString(e)) return (await d(e)).byteLength;
	}, g = async (e, t) => B.toFiniteNumber(e.getContentLength()) ?? h(t);
	return async (e) => {
		let { url: t, method: n, data: s, signal: l, cancelToken: u, timeout: d, onDownloadProgress: h, onUploadProgress: _, responseType: v, headers: y, withCredentials: b = "same-origin", fetchOptions: x, maxContentLength: S, maxBodyLength: C } = tn(e), w = B.isNumber(S) && S > -1, T = B.isNumber(C) && C > -1, E = i || fetch;
		v = v ? (v + "").toLowerCase() : "text";
		let D = rn([l, u && u.toAbortSignal()], d), O = null, k = D && D.unsubscribe && (() => {
			D.unsubscribe();
		}), A;
		try {
			if (w && typeof t == "string" && t.startsWith("data:") && ln(t) > S) throw new W("maxContentLength size of " + S + " exceeded", W.ERR_BAD_RESPONSE, e, O);
			if (T && n !== "get" && n !== "head") {
				let t = await g(y, s);
				if (typeof t == "number" && isFinite(t) && t > C) throw new W("Request body larger than maxBodyLength limit", W.ERR_BAD_REQUEST, e, O);
			}
			if (_ && f && n !== "get" && n !== "head" && (A = await g(y, s)) !== 0) {
				let e = new a(t, {
					method: "POST",
					body: s,
					duplex: "half"
				}), n;
				if (B.isFormData(s) && (n = e.headers.get("content-type")) && y.setContentType(n), e.body) {
					let [t, n] = Wt(A, Ut(Gt(_)));
					s = cn(e.body, dn, t, n);
				}
			}
			B.isString(b) || (b = b ? "include" : "omit");
			let i = c && "credentials" in a.prototype;
			if (B.isFormData(s)) {
				let e = y.getContentType();
				e && /^multipart\/form-data/i.test(e) && !/boundary=/i.test(e) && y.delete("content-type");
			}
			y.set("User-Agent", "axios/" + un, !1);
			let l = {
				...x,
				signal: D,
				method: n.toUpperCase(),
				headers: nt(y.normalize()),
				body: s,
				duplex: "half",
				credentials: i ? b : void 0
			};
			O = c && new a(t, l);
			let u = await (c ? E(O, x) : E(t, l));
			if (w) {
				let t = B.toFiniteNumber(u.headers.get("content-length"));
				if (t != null && t > S) throw new W("maxContentLength size of " + S + " exceeded", W.ERR_BAD_RESPONSE, e, O);
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
				let n = B.toFiniteNumber(u.headers.get("content-length")), [r, i] = h && Wt(n, Ut(Gt(h), !0)) || [], a = 0;
				u = new o(cn(u.body, dn, (t) => {
					if (w && (a = t, a > S)) throw new W("maxContentLength size of " + S + " exceeded", W.ERR_BAD_RESPONSE, e, O);
					r && r(t);
				}, () => {
					i && i(), k && k();
				}), t);
			}
			v ||= "text";
			let j = await m[B.findKey(m, v) || "text"](u, e);
			if (w && !p && !d) {
				let t;
				if (j != null && (typeof j.byteLength == "number" ? t = j.byteLength : typeof j.size == "number" ? t = j.size : typeof j == "string" && (t = typeof r == "function" ? new r().encode(j).byteLength : j.length)), typeof t == "number" && t > S) throw new W("maxContentLength size of " + S + " exceeded", W.ERR_BAD_RESPONSE, e, O);
			}
			return !d && k && k(), await new Promise((t, n) => {
				zt(t, n, {
					data: j,
					headers: U.from(u.headers),
					status: u.status,
					statusText: u.statusText,
					config: e,
					request: O
				});
			});
		} catch (t) {
			if (k && k(), D && D.aborted && D.reason instanceof W) {
				let n = D.reason;
				throw n.config = e, O && (n.request = O), t !== n && (n.cause = t), n;
			}
			throw t && t.name === "TypeError" && /Load failed|fetch/i.test(t.message) ? Object.assign(new W("Network Error", W.ERR_NETWORK, e, O, t && t.response), { cause: t.cause || t }) : W.from(t, t && t.code, e, O, t && t.response);
		}
	};
}, hn = /* @__PURE__ */ new Map(), gn = (e) => {
	let t = e && e.env || {}, { fetch: n, Request: r, Response: i } = t, a = [
		r,
		i,
		n
	], o = a.length, s, c, l = hn;
	for (; o--;) s = a[o], c = l.get(s), c === void 0 && l.set(s, c = o ? /* @__PURE__ */ new Map() : mn(t)), l = c;
	return c;
};
gn();
//#endregion
//#region node_modules/axios/lib/adapters/adapters.js
var _n = {
	http: null,
	xhr: nn,
	fetch: { get: gn }
};
B.forEach(_n, (e, t) => {
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
var vn = (e) => `- ${e}`, yn = (e) => B.isFunction(e) || e === null || e === !1;
function bn(e, t) {
	e = B.isArray(e) ? e : [e];
	let { length: n } = e, r, i, a = {};
	for (let o = 0; o < n; o++) {
		r = e[o];
		let n;
		if (i = r, !yn(r) && (i = _n[(n = String(r)).toLowerCase()], i === void 0)) throw new W(`Unknown adapter '${n}'`);
		if (i && (B.isFunction(i) || (i = i.get(t)))) break;
		a[n || "#" + o] = i;
	}
	if (!i) {
		let e = Object.entries(a).map(([e, t]) => `adapter ${e} ` + (t === !1 ? "is not supported by the environment" : "is not available in the build"));
		throw new W("There is no suitable adapter to dispatch the request " + (n ? e.length > 1 ? "since :\n" + e.map(vn).join("\n") : " " + vn(e[0]) : "as no adapter specified"), "ERR_NOT_SUPPORT");
	}
	return i;
}
var xn = {
	getAdapter: bn,
	adapters: _n
};
//#endregion
//#region node_modules/axios/lib/core/dispatchRequest.js
function Sn(e) {
	if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new J(null, e);
}
function Cn(e) {
	return Sn(e), e.headers = U.from(e.headers), e.data = Lt.call(e, e.transformRequest), [
		"post",
		"put",
		"patch"
	].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), xn.getAdapter(e.adapter || q.adapter, e)(e).then(function(t) {
		Sn(e), e.response = t;
		try {
			t.data = Lt.call(e, e.transformResponse, t);
		} finally {
			delete e.response;
		}
		return t.headers = U.from(t.headers), t;
	}, function(t) {
		if (!Rt(t) && (Sn(e), t && t.response)) {
			e.response = t.response;
			try {
				t.response.data = Lt.call(e, e.transformResponse, t.response);
			} finally {
				delete e.response;
			}
			t.response.headers = U.from(t.response.headers);
		}
		return Promise.reject(t);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/validator.js
var X = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((e, t) => {
	X[e] = function(n) {
		return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
	};
});
var wn = {};
X.transitional = function(e, t, n) {
	function r(e, t) {
		return "[Axios v" + un + "] Transitional option '" + e + "'" + t + (n ? ". " + n : "");
	}
	return (n, i, a) => {
		if (e === !1) throw new W(r(i, " has been removed" + (t ? " in " + t : "")), W.ERR_DEPRECATED);
		return t && !wn[i] && (wn[i] = !0, console.warn(r(i, " has been deprecated since v" + t + " and will be removed in the near future"))), e ? e(n, i, a) : !0;
	};
}, X.spelling = function(e) {
	return (t, n) => (console.warn(`${n} is likely a misspelling of ${e}`), !0);
};
function Tn(e, t, n) {
	if (typeof e != "object") throw new W("options must be an object", W.ERR_BAD_OPTION_VALUE);
	let r = Object.keys(e), i = r.length;
	for (; i-- > 0;) {
		let a = r[i], o = Object.prototype.hasOwnProperty.call(t, a) ? t[a] : void 0;
		if (o) {
			let t = e[a], n = t === void 0 || o(t, a, e);
			if (n !== !0) throw new W("option " + a + " must be " + n, W.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (n !== !0) throw new W("Unknown option " + a, W.ERR_BAD_OPTION);
	}
}
var En = {
	assertOptions: Tn,
	validators: X
}, Z = En.validators, Q = class {
	constructor(e) {
		this.defaults = e || {}, this.interceptors = {
			request: new Ct(),
			response: new Ct()
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
		typeof e == "string" ? (t ||= {}, t.url = e) : t = e || {}, t = Y(this.defaults, t);
		let { transitional: n, paramsSerializer: r, headers: i } = t;
		n !== void 0 && En.assertOptions(n, {
			silentJSONParsing: Z.transitional(Z.boolean),
			forcedJSONParsing: Z.transitional(Z.boolean),
			clarifyTimeoutError: Z.transitional(Z.boolean),
			legacyInterceptorReqResOrdering: Z.transitional(Z.boolean)
		}, !1), r != null && (B.isFunction(r) ? t.paramsSerializer = { serialize: r } : En.assertOptions(r, {
			encode: Z.function,
			serialize: Z.function
		}, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls === void 0 ? t.allowAbsoluteUrls = !0 : t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls), En.assertOptions(t, {
			baseUrl: Z.spelling("baseURL"),
			withXsrfToken: Z.spelling("withXSRFToken")
		}, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
		let a = i && B.merge(i.common, i[t.method]);
		i && B.forEach([
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
		}), t.headers = U.concat(a, i);
		let o = [], s = !0;
		this.interceptors.request.forEach(function(e) {
			if (typeof e.runWhen == "function" && e.runWhen(t) === !1) return;
			s &&= e.synchronous;
			let n = t.transitional || wt;
			n && n.legacyInterceptorReqResOrdering ? o.unshift(e.fulfilled, e.rejected) : o.push(e.fulfilled, e.rejected);
		});
		let c = [];
		this.interceptors.response.forEach(function(e) {
			c.push(e.fulfilled, e.rejected);
		});
		let l, u = 0, d;
		if (!s) {
			let e = [Cn.bind(this), void 0];
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
			l = Cn.call(this, f);
		} catch (e) {
			return Promise.reject(e);
		}
		for (u = 0, d = c.length; u < d;) l = l.then(c[u++], c[u++]);
		return l;
	}
	getUri(e) {
		return e = Y(this.defaults, e), St(Xt(e.baseURL, e.url, e.allowAbsoluteUrls), e.params, e.paramsSerializer);
	}
};
B.forEach([
	"delete",
	"get",
	"head",
	"options"
], function(e) {
	Q.prototype[e] = function(t, n) {
		return this.request(Y(n || {}, {
			method: e,
			url: t,
			data: (n || {}).data
		}));
	};
}), B.forEach([
	"post",
	"put",
	"patch",
	"query"
], function(e) {
	function t(t) {
		return function(n, r, i) {
			return this.request(Y(i || {}, {
				method: e,
				headers: t ? { "Content-Type": "multipart/form-data" } : {},
				url: n,
				data: r
			}));
		};
	}
	Q.prototype[e] = t(), e !== "query" && (Q.prototype[e + "Form"] = t(!0));
});
//#endregion
//#region node_modules/axios/lib/cancel/CancelToken.js
var Dn = class e {
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
			n.reason || (n.reason = new J(e, r, i), t(n.reason));
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
function On(e) {
	return function(t) {
		return e.apply(null, t);
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/isAxiosError.js
function kn(e) {
	return B.isObject(e) && e.isAxiosError === !0;
}
//#endregion
//#region node_modules/axios/lib/helpers/HttpStatusCode.js
var An = {
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
Object.entries(An).forEach(([e, t]) => {
	An[t] = e;
});
//#endregion
//#region node_modules/axios/lib/axios.js
function jn(e) {
	let t = new Q(e), n = C(Q.prototype.request, t);
	return B.extend(n, Q.prototype, t, { allOwnKeys: !0 }), B.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(t) {
		return jn(Y(e, t));
	}, n;
}
var $ = jn(q);
$.Axios = Q, $.CanceledError = J, $.CancelToken = Dn, $.isCancel = Rt, $.VERSION = un, $.toFormData = _t, $.AxiosError = W, $.Cancel = $.CanceledError, $.all = function(e) {
	return Promise.all(e);
}, $.spread = On, $.isAxiosError = kn, $.mergeConfig = Y, $.AxiosHeaders = U, $.formToJSON = (e) => Ft(B.isHTMLForm(e) ? new FormData(e) : e), $.getAdapter = xn.getAdapter, $.HttpStatusCode = An, $.default = $;
var Mn = $.create({
	baseURL: "/api/v1",
	timeout: 3500
});
Mn.interceptors.response.use((e) => e, (e) => (!e.response && (e.request || e.message === "Network Error") && (e.isBackendOffline = !0, e.message = "Backend is not connected. Start the backend server to enable blog data."), Promise.reject(e)));
var Nn = (e) => e ? { headers: { Authorization: `Bearer ${e}` } } : {}, Pn = () => Mn.get("/home-content"), Fn = (e, t) => Mn.put("/home-content", e, {
	...Nn(t),
	timeout: 3e4
}), In = {
	cover_image: n("fyuobot-ts.svg"),
	cover_title: "fyuobot-ts",
	cover_github_url: "https://github.com/fyuo863/fyuobot-ts",
	cover_description: "事件驱动的轻量化 Agent 框架.",
	projects: [
		{
			image: n("fyuo-blogs.svg"),
			title: "fyuo-blogs.",
			link_url: "https://github.com/fyuo863/fyuo-blogs",
			description: "个人博客项目(即本网站)."
		},
		{
			image: n("go-file-fetch.svg"),
			title: "go-file-fetch",
			link_url: "https://github.com/fyuo863/go-file-fetch",
			description: "简单的多线程文件下载器."
		},
		{
			image: n("fyuo-bot.svg"),
			title: "fyuo-bot",
			link_url: "https://github.com/fyuo863/fyuo_bot",
			description: "一个轻量化的 Agent 框架."
		},
		{
			image: n("fyuo-ops.svg"),
			title: "fyuo-ops",
			link_url: "https://github.com/fyuo863/fyuo-ops",
			description: "运维特化 Agent."
		},
		{
			image: n("fyuobot-ts.svg"),
			title: "fyuobot-ts",
			link_url: "https://github.com/fyuo863/fyuobot-ts",
			description: "TypeScript 版本的模块化 Agent 框架."
		},
		{
			image: n("fyuobot-ts-tools.svg"),
			title: "fyuobot-ts-tools",
			link_url: "https://github.com/fyuo863/fyuobot-ts-tools",
			description: "fyuobot-ts 使用的工具集."
		}
	]
}, Ln = (e) => ({
	cover_github_url: e.cover_github_url,
	cover_description: e.cover_description,
	projects: e.projects.map((e) => ({
		link_url: e.link_url,
		description: e.description
	}))
}), Rn = () => ({
	link_url: "",
	description: ""
});
function zn({ user: e, onOpenSignIn: t, onLogout: n, onNotify: r }) {
	let i = l(), [c, u] = s(In), [p, h] = s(null), [g, _] = s(!1), [v, y] = s(!0), C = o(null), w = o("");
	a(() => {
		let e = !1;
		return Pn().then((t) => {
			!e && t.data?.data && u(t.data.data);
		}).catch(() => {}).finally(() => {
			e || y(!1);
		}), () => {
			e = !0;
		};
	}, []), a(() => {
		let t = () => {
			!e?.token || v || (h(Ln(c)), requestAnimationFrame(() => {
				C.current?.scrollIntoView({
					block: "start",
					behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
				});
			}));
		};
		return window.addEventListener("fyuo:edit-home", t), () => window.removeEventListener("fyuo:edit-home", t);
	}, [
		c,
		v,
		e?.token
	]), a(() => {
		!e?.token || v || new URLSearchParams(i.search).get("desk") !== "home" || w.current === i.search || (h(Ln(c)), w.current = i.search);
	}, [
		c,
		v,
		i.search,
		e?.token
	]);
	let T = () => h(null), E = (e, t) => h((n) => ({
		...n,
		[e]: t
	})), D = (e, t, n) => {
		h((r) => ({
			...r,
			projects: r.projects.map((r, i) => i === e ? {
				...r,
				[t]: n
			} : r)
		}));
	}, O = () => h((e) => ({
		...e,
		projects: [...e.projects, Rn()]
	})), k = (e) => h((t) => ({
		...t,
		projects: t.projects.filter((t, n) => n !== e)
	}));
	return /* @__PURE__ */ f("div", {
		className: "home-page",
		children: [
			/* @__PURE__ */ d(S, {
				strength: .75,
				children: /* @__PURE__ */ f("section", {
					className: "home-cover",
					"aria-labelledby": "home-title",
					children: [
						/* @__PURE__ */ d("p", {
							className: "cover-edition",
							children: "fyuo / independent work / issue 01"
						}),
						/* @__PURE__ */ f(x, {
							id: "home-title",
							children: [/* @__PURE__ */ d("span", { children: "PROJECTS" }), /* @__PURE__ */ d("span", { children: "& NOTES" })]
						}),
						/* @__PURE__ */ f("div", {
							className: "cover-deck",
							children: [/* @__PURE__ */ d("p", { children: "我的个人主页。" }), /* @__PURE__ */ d("a", {
								className: "cover-link",
								href: "#projects",
								children: "view the index ↓"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ d(S, {
				strength: 1.05,
				children: /* @__PURE__ */ d("section", {
					className: "home-feature",
					"aria-label": "Featured project",
					children: /* @__PURE__ */ d(m, {
						image: c.cover_image,
						title: c.cover_title,
						githubUrl: c.cover_github_url,
						description: c.cover_description
					})
				})
			}),
			/* @__PURE__ */ d(S, {
				strength: 1,
				children: /* @__PURE__ */ f("section", {
					className: "projects-section",
					id: "projects",
					"aria-labelledby": "projects-title",
					children: [/* @__PURE__ */ f("header", {
						className: "section-head",
						children: [/* @__PURE__ */ f("div", { children: [/* @__PURE__ */ d("p", {
							className: "section-kicker",
							children: "the index / 02—07"
						}), /* @__PURE__ */ d("h2", {
							className: "section-title",
							id: "projects-title",
							children: /* @__PURE__ */ d("span", {
								className: "section-title__selected",
								children: "Selected work."
							})
						})] }), /* @__PURE__ */ d("p", {
							className: "section-note",
							children: "精选项目"
						})]
					}), /* @__PURE__ */ d(b, { projects: c.projects.map(({ link_url: e, ...t }) => ({
						...t,
						linkUrl: e
					})) })]
				})
			}),
			p && /* @__PURE__ */ d("section", {
				className: "home-editor",
				ref: C,
				"aria-labelledby": "home-editor-title",
				tabIndex: "-1",
				children: /* @__PURE__ */ f("form", {
					onSubmit: async (i) => {
						if (i.preventDefault(), p) {
							if (!e?.token) {
								r?.({
									title: "login-required.",
									message: "登录状态不可用，请重新登录后再保存。"
								}), n?.(), t?.();
								return;
							}
							_(!0);
							try {
								u((await Fn(p, e.token)).data.data), h(null), r?.({
									title: "saved.",
									message: "首页内容已更新。"
								});
							} catch (e) {
								e?.response?.status === 401 ? (n?.(), t?.(), r?.({
									title: "session-expired.",
									message: "登录已过期，请重新登录后再保存首页内容。"
								})) : r?.({
									title: "save failed.",
									message: e?.response?.data?.error || "首页内容暂时无法保存。"
								});
							} finally {
								_(!1);
							}
						}
					},
					children: [
						/* @__PURE__ */ f("header", {
							className: "home-editor__head",
							children: [/* @__PURE__ */ f("div", { children: [/* @__PURE__ */ d("p", {
								className: "section-kicker",
								children: "editor / authenticated"
							}), /* @__PURE__ */ d("h2", {
								id: "home-editor-title",
								children: "Home content."
							})] }), /* @__PURE__ */ d("button", {
								className: "home-editor__close",
								type: "button",
								onClick: T,
								children: "close ×"
							})]
						}),
						/* @__PURE__ */ f("fieldset", {
							className: "home-editor__fieldset",
							children: [
								/* @__PURE__ */ d("legend", { children: "Cover Story" }),
								/* @__PURE__ */ f("label", { children: ["GitHub 仓库链接", /* @__PURE__ */ d("input", {
									type: "url",
									value: p.cover_github_url,
									onChange: (e) => E("cover_github_url", e.target.value),
									placeholder: "https://github.com/owner/repository",
									required: !0
								})] }),
								/* @__PURE__ */ f("label", { children: ["简介", /* @__PURE__ */ d("textarea", {
									value: p.cover_description,
									onChange: (e) => E("cover_description", e.target.value),
									required: !0
								})] })
							]
						}),
						/* @__PURE__ */ f("fieldset", {
							className: "home-editor__fieldset",
							children: [
								/* @__PURE__ */ d("legend", { children: "Selected Work" }),
								/* @__PURE__ */ d("div", {
									className: "home-editor__projects",
									children: p.projects.map((e, t) => /* @__PURE__ */ f("article", {
										className: "home-editor__project",
										children: [
											/* @__PURE__ */ f("div", {
												className: "home-editor__project-head",
												children: [/* @__PURE__ */ d("strong", { children: String(t + 1).padStart(2, "0") }), p.projects.length > 1 && /* @__PURE__ */ d("button", {
													type: "button",
													onClick: () => k(t),
													children: "remove"
												})]
											}),
											/* @__PURE__ */ f("label", { children: ["GitHub 仓库链接", /* @__PURE__ */ d("input", {
												type: "url",
												value: e.link_url,
												onChange: (e) => D(t, "link_url", e.target.value),
												placeholder: "https://github.com/owner/repository",
												required: !0
											})] }),
											/* @__PURE__ */ f("label", { children: ["简介", /* @__PURE__ */ d("textarea", {
												value: e.description,
												onChange: (e) => D(t, "description", e.target.value),
												required: !0
											})] })
										]
									}, `${e.link_url}-${t}`))
								}),
								/* @__PURE__ */ d("button", {
									className: "home-editor__add",
									type: "button",
									onClick: O,
									children: "+ add project"
								})
							]
						}),
						/* @__PURE__ */ f("footer", {
							className: "home-editor__actions",
							children: [/* @__PURE__ */ d("button", {
								type: "button",
								onClick: T,
								children: "cancel"
							}), /* @__PURE__ */ d("button", {
								type: "submit",
								disabled: g,
								children: g ? "saving…" : "save changes"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { zn as default };
