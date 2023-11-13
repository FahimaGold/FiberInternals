# React Fiber

This codebase is used for debugging fiber's data structure and the different functions invovled in the reconciliation.

This app is rendered by:

- `createRoot()`
- `react-dom@18.2.0`

The image below demonstrates the component tree of this app:

![component tree](img/component_tree.png)

Which contains the App component, the div which contains two images, one of `React` and the other of `Vite`, `h1` the header which contains the title `Vite + React`, and finally the `MyButton` component which wraps `button`.

Now let's look at the fiber's tree, which displays only 3 host elements:

![fiber tree](img/fiber_tree.png)

`<div>`, `h1`, and `<button>`. If we expand the button element, we get to see  the following:

![fiber button structure](img/fiber_button_structure.png)

- `__reactFiber$hwiy9k0i6jt`: which is the fiber corresponding to the button element.
FiberNode `{tag: 5, key: null, elementType: 'button', type: 'button', stateNode: button, …}`
- `__reactProps$hwiy9k0i6jt`:  which is the properties passed to the fiber, and in this case, it is the onClick, and count.
`{children: Array(2), onClick: ƒ}`.

We expend further the fiber and the props:

```
__reactFiber$hwiy9k0i6jt: FiberNode
  actualDuration: 0.4000000059604645
  actualStartTime: 1474.7000000178814
  alternate: null
  child: 
  FiberNode {tag: 6, key: null, elementType: null, type: null
  stateNode: text, …}
  childLanes: 0
  deletions: null
  dependencies: null
  elementType: "button"
  flags: 0
  index: 0
  key: null
  lanes: 0
  memoizedProps: {children: Array(2), onClick: ƒ}
  memoizedState: null
  mode: 27
  pendingProps: {children: Array(2), onClick: ƒ}
  ref: null
  return: FiberNode {tag: 0, key: null, stateNode: null, elementType: ƒ, type: ƒ, …}
  selfBaseDuration: 0
  sibling: null
  stateNode: button
  subtreeFlags: 1048576
  tag: 5
  treeBaseDuration: 0
  type: "button"
  updateQueue: null
  _debugHookTypes: null
  _debugNeedsRemount: false
  _debugOwner: FiberNode {tag: 0, key: null, stateNode: null, elementType: ƒ, type: ƒ, …}
  _debugSource: {fileName: 'react-fiber/src/components/MyButton.jsx', lineNumber: 4, columnNumber: 12}
  [[Prototype]]: Object
__reactProps$hwiy9k0i6jt: 
children: Array(2)
  0: "count is "
  1: 0
  length: 2
  [[Prototype]]: Array(0)
onClick: ƒ updateCounter()
  length: 0
  name: "updateCounter"
  prototype: {constructor: ƒ}
  arguments: (...)
  caller: (...)
  [[FunctionLocation]]: App.jsx:9`
```

