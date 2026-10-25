import { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

// Both layers are live React trees. Stable keys retain the outgoing page's
// timers, canvas and scroll position until the expanding ring has passed.
export default class LiveRingTransition extends Component {
  constructor(props) {
    super(props);
    this.state = { current: { id: 0, location: props.location, content: props.children }, outgoing: null, sequence: 0 };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.current.location.pathname) {
      const sequence = state.sequence + 1;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return { current: { id: sequence, location: props.location, content: props.children }, outgoing: reduced ? null : state.current, sequence };
    }
    return { current: { ...state.current, location: props.location, content: props.children } };
  }

  componentDidUpdate(_props, previous) {
    if (previous.sequence !== this.state.sequence) {
      clearTimeout(this.timer);
      if (this.state.outgoing) this.timer = setTimeout(this.finish, 850);
    }
  }

  componentWillUnmount() { clearTimeout(this.timer); }

  finish = () => {
    clearTimeout(this.timer);
    if (this.state.outgoing) this.setState({ outgoing: null });
  };

  render() {
    const { current, outgoing, sequence } = this.state;
    return <div className="route-pages" data-running={Boolean(outgoing)} onAnimationEnd={event => { if (event.target === event.currentTarget) this.finish(); }}>
      {[outgoing, current].filter(Boolean).map(layer => <div key={layer.id} className={`route-live-layer ${layer.id === current.id ? 'is-current' : 'is-outgoing'}`} inert={layer.id !== current.id} aria-hidden={layer.id !== current.id ? true : undefined}>
        <Routes location={layer.location}><Route path="*" element={layer.content} /></Routes>
      </div>)}
      {outgoing && <div key={`ring-${sequence}`} className="route-live-ring" aria-hidden="true" />}
    </div>;
  }
}
