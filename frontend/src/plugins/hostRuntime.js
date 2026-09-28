import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JSXRuntime from 'react/jsx-runtime';
import * as Router from 'react-router-dom';

// Shared instances keep hooks, portals and router context in the original tree.
// Compatibility contract: preserve API v1 exports across host-only releases.
// Introduce a new runtime namespace for breaking changes; retain v1 for existing packages.
// Only administrator-trusted module plugins may use this runtime.
globalThis.__FYUO_PLUGIN_HOST_V1__ = Object.freeze({
  react: React,
  'react-dom': ReactDOM,
  'react/jsx-runtime': JSXRuntime,
  'react-router-dom': Router,
});
