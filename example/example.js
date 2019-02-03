import React, { useState } from "react";
import ReactDOM from "react-dom";
import Splitter from "../src/index";
import "./example.css";

const layouts = [
  "empty",
  "one",
  "horz",
  "vert",
  "nested",
  "deep_nested",
  "measured",
  "with_callback"
];

function printSize(childSizes, idx) {
  if (childSizes && childSizes[idx])
    return `${childSizes[idx].width}x${childSizes[idx].height}`;
  return "-";
}

const components = {
  empty: () => <Splitter />,

  one: () => (
    <Splitter key="one">
      <div>one</div>
    </Splitter>
  ),

  horz: () => (
    <Splitter key="horz">
      <div key="left">left</div>
      <div key="right">right</div>
    </Splitter>
  ),

  vert: () => (
    <Splitter vertical key="vert">
      <div key="up">up</div>
      <div key="down">down</div>
    </Splitter>
  ),

  nested: () => (
    <Splitter key="nested">
      <Splitter vertical>
        <div key="up">up</div>
        <div key="down">down</div>
      </Splitter>
      <div key="right">right</div>
    </Splitter>
  ),

  deep_nested: () => (
    <Splitter key="deep_nested">
      <Splitter key="child" vertical>
        <Splitter key="grand_child" vertical>
          <div key="up.up">up.up</div>
          <div key="up.down">up.down</div>
        </Splitter>
        <div key="down">down</div>
      </Splitter>
      <div key="right">right</div>
    </Splitter>
  ),

  measured: () => (
    <Splitter size="33%" key="measured">
      <div key="m_left">left</div>
      <div key="m_right">right</div>
    </Splitter>
  ),

  with_callback: (onResize, sizes) => (
    <Splitter size="50%" key="with_callback" onResize={onResize}>
      <h2 key="m_left" style={{ padding: "20px" }}>
        left:
        {printSize(sizes, 0)}
      </h2>
      <h2 key="m_right" style={{ padding: "20px" }}>
        right:
        {printSize(sizes, 2)}
      </h2>
    </Splitter>
  )
};
function App() {
  const [activeLayoutIndex, setActiveLayoutIndex] = useState(0);
  const [childSizes, setChildSizes] = useState(null);

  function onLayoutChange(layout) {
    setActiveLayoutIndex(layout);
  }

  function onResize(sizes) {
    setChildSizes([...sizes]);
  }

  function render() {
    const comp = components[layouts[activeLayoutIndex]];
    return (
      <div className="container">
        <Linkbar active={activeLayoutIndex} onChange={onLayoutChange} />
        <main className="main">{comp(onResize, childSizes)}</main>
      </div>
    );
  }
  return render();
}

function Linkbar({ onChange, active }) {
  function render() {
    const actions = layouts.map((layout, index) => (
      <button
        key={index}
        className={index === active ? "link active" : "link"}
        onClick={() => onChange(index)}
      >
        {layouts[index]}
      </button>
    ));
    return <div className="linkbar">{actions}</div>;
  }
  return render();
}

ReactDOM.render(<App />, document.getElementById("app"));
