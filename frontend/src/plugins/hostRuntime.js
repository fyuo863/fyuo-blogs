import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JSXRuntime from 'react/jsx-runtime';
import * as Router from 'react-router-dom';

// Shared instances keep hooks, portals and router context in the original tree.
// Only administrator-trusted module plugins may use this runtime.
globalThis.__FYUO_PLUGIN_HOST_V1__ = Object.freeze({
  react: React,
  'react-dom': ReactDOM,
  'react/jsx-runtime': JSXRuntime,
  'react-router-dom': Router,
});
