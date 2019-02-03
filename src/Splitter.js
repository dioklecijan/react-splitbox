import React, { useState, useEffect, useRef } from "react";
import "./splitter.css";

// 3px padding on each side (left/right or top/bottom) and 1px line in the
// middle => 7px area to capture mouse
const DIVIDER_SIZE = 7;

/**
 *
 * @param {boolean} vertical Splitter orientaion
 * @param {?React.Node} children Splitter panes
 * @param {sizes:Array<{width:number, height:number}> => mixed} onResize
 *        Callback that will receive an array of dimensions of each Splitter
 *        child including divider.
 * @param {string} size Initial size of the second pane ('50%', '300px', etc)
 */
export default function Splitter({ vertical, children, onResize, size }) {
  // state vars
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // resizing = mouse is pressed on divider and moving
  const [resizing, setResizing] = useState(false);

  // Children {width, height} array
  const [sizes, setSizes] = useState([]);

  // second pane flex basis css attrib
  // TODO: The value should be decreased by DIVIDER_SIZE / 2 pixels
  const [flexBasis, setFlexBasis] = useState(size);

  // container element
  const splitterElem = useRef(null);

  // effects
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // register/unregister document listeners
  useEffect(() => {
    document.addEventListener("mousemove", onDocMouseMove);
    document.addEventListener("mouseup", onDocMouseUp);
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mouseup", onDocMouseUp);
      document.removeEventListener("mousemove", onDocMouseMove);
    };
  }, [resizing, sizes]);

  // event handlers
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // when browser window resize, update pane sizes
  function onWindowResize() {
    updateSizes();
  }

  // Calculate the dimensions of the panes and update state
  function onDocMouseMove(evt) {
    if (resizing) {
      // convert the screen coordinates to the parent coord system
      const { x, y } = splitterElem.current.getBoundingClientRect();
      updateSizes(vertical ? evt.clientY - y : evt.clientX - x);
    }
  }

  function onDocMouseUp() {
    return setResizing(false);
  }

  // local helpers
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Update sizes state and inform parent (onResize).
  // If divider moved, update second pane flex-basis CSS prop
  function updateSizes(dividerPosition = null) {
    if (!splitterElem || !splitterElem.current) return;
    let arr = [];
    const len = splitterElem.current.childNodes.length;
    if (len === 0) return;
    if (len !== 1 && len !== 3) {
      console.error("Splitter requires none, one or two childs.");
      return;
    }
    if (dividerPosition === null || len === 1) {
      for (let index = 0; index < len; index++) {
        const element = splitterElem.current.childNodes[index];
        arr.push({ width: element.clientWidth, height: element.clientHeight });
      }
    } else {
      arr = [];
      if (vertical) {
        const totalHeight = splitterElem.current.clientHeight;
        for (let i = 0; i < 3; i++)
          arr.push({
            height: undefined,
            width: splitterElem.current.clientWidth
          });
        arr[2].height = totalHeight - dividerPosition - DIVIDER_SIZE / 2;
        arr[1].height = DIVIDER_SIZE;
        arr[0].height = totalHeight - arr[2].height - arr[1].height;
        setFlexBasis(`${arr[2].height}px`);
      } else {
        const totalWidth = splitterElem.current.clientWidth;
        for (let i = 0; i < 3; i++)
          arr.push({
            width: undefined,
            height: splitterElem.current.clientHeight
          });
        arr[2].width = totalWidth - dividerPosition - DIVIDER_SIZE / 2;
        arr[1].width = DIVIDER_SIZE;
        arr[0].width = totalWidth - arr[2].width - arr[1].width;
        setFlexBasis(`${arr[2].width}px`);
      }
    }
    setSizes(arr);
    if (onResize) onResize(arr);
  }

  // rendering parts
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Wrap children into Panes and adds divider between them
  function wrapChildren() {
    const arr = [];
    const count = React.Children.count(children);
    const arrChildren = React.Children.toArray(children);
    if (count > 0) {
      arr.push(
        <Pane key="pane-0" vertical={vertical}>
          {arrChildren[0]}
        </Pane>
      );
      if (count > 1) {
        // add divider
        const sty = {};
        if (vertical) sty.height = `${DIVIDER_SIZE}px`;
        else sty.width = `${DIVIDER_SIZE}px`;
        arr.push(
          <div
            key="divider"
            className={resizing ? "divider resizing" : "divider"}
            onMouseDown={() => setResizing(true)}
            style={sty}
          >
            <div />
          </div>
        );
        // and set the second pane size via css flex-basis
        const secondPaneStyle = { flexBasis };
        arr.push(
          <Pane key="pane-1" vertical={vertical} style={secondPaneStyle}>
            {arrChildren[1]}
          </Pane>
        );
      }
    }
    return arr;
  }

  // public
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function render() {
    const wrappedChildren = wrapChildren();
    return (
      <div
        className={vertical ? "splitter vertical" : "splitter"}
        ref={splitterElem}
      >
        {wrappedChildren}
      </div>
    );
  }

  return render();
}

Splitter.defaultProps = {
  vertical: false,
  children: null,
  onResize: null,
  size: "50%"
};

function Pane({ children, style }) {
  return (
    <div className="pane" style={style}>
      {children}
    </div>
  );
}
