# React Fiber

## Brief Overview of React Fibers

React Fiber is the new reconcilier that was created from scratch starting from `React 16` in order to overcome the shortcomings of using the javascript call stack (which I will soon speak of in an article). React fiber came into place for these four reasons:
- Pause a work and come back to it later
- Assign priority to different types of work
- Reuse previously completed work
- Abort work if it's no longer needed

💫 ***What is exaclty fiber at implementation level?***

A fiber is simply a javascript object that contains information about React elements and components, such as the type of the element, the key, the props passed to the given element, etc.

Fibers are also considered as a ***unit of work*** and give priorities to the different units of work so that they are executed based on their priorities. The priorities are defined in [SchedulerPriorities.js](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerPriorities.js):
-  `0`: NoPriority
-  `1`: ImmediatePriority
-  `2`: UserBlockingPriority
-  `3`: NormalPriority
-  `4`: LowPriority
-  `5`: IdlePriority

Except NoPriority, the priorities are mentioned in a descending order. ImmediatePriority can be something related to a UI interaction and needs to be executed immediately for a great user experience. Some other tasks can wait until the main thread is idle and can be executed by then. 

## 🏃‍♂️ To Debugging ##

This app codebase is used for debugging fiber's data structure and the different functions involved in the reconciliation. 

The app is very simple, created using `Vite`, I just created a component `MyButton` and used it in the App so that when clicked, it increments a counter.

This app is rendered by:

- `createRoot()`
- `react-dom@18.2.0`

The image below demonstrates the component tree of this app:

![component tree](img/component_tree.png)

Which contains the App component, the div which contains two images, one of `React` and the other of `Vite`, `h1` the header which contains the title `Vite + React`, and finally the `MyButton` component which wraps `button`.

Now let's look at the fiber's tree, which displays only 3 host elements:

![fiber tree](img/fiber_tree.png)

`<div>`, `h1`, and `<button>`, which are the parents of each subtree. We also see that `MyButton` component, which is a wrapper of `button`is not shown in the fiber tree, and instead, `button` is shown directly. If we expand the button element, we get to see  the following:

![fiber button structure](img/fiber_button_structure.png)

- `__reactFiber$hwiy9k0i6jt`: which is the fiber corresponding to the button element.
FiberNode `{tag: 5, key: null, elementType: 'button', type: 'button', stateNode: button, …}`
- `__reactProps$hwiy9k0i6jt`:  which is the properties passed to the fiber, and in this case, it is the onClick, and count.
`{children: Array(2), onClick: ƒ}`.


## Description of the content of the fiber tree

The fiber node in `__reactFiber$hwiy9k0i6jt` of the `MyButton` component contains the following properties:
- `tag`: It is a number that represents the type of the fiber. For instance, `5` means a DOM element, `6` a text node, and here is the entire list from [react describeFibers.js](https://github.com/facebook/react/blob/432b9f1d9729aaea010730d546bda89b9842eaa1/fixtures/fiber-debugger/src/describeFibers.js#L12):
    - `0`: Indeterminate
    - `1`: Function component
    - `2`: Class component
    - `3`: The root of the host component (Eg, App, the root of the react App)
    - `4`: A Portal
    - `5`: A host component (a DOM element)
    - `6`: A text element
    - `7`: Caroutine
    - `8`: Handler
    - `9`: Yield
    - `10`: Fragments

- `key`: It is the same key used to uniquely identify elements in React during reconciliation. In this example, it is `null` since no key was used.

- `elementType`: It represents the original type of the React element as the user defines it, such as function components, class components, a special React type such as Fragmenet, or string with the HTML tag name for host elements. 
- `type`: It is used when `type` needs to be modified or resolved in order to reperesent the latest version of `type` in hot-reloading environments. Example of why `elementType` is used:
    ```
    // Original component
    function MyComponent() {
        // ...
        }

    // Usage in the app
    const element = <MyComponent />;
    ```
Let's say `MyComponent` is updated and you perform hot-reloading,  `type` might still refer to the old version of `MyComponent`, and hence `elementType` is used to resolve `type` during hot-reloading.
- `stateNode`: It refers to the actual component instance or the DOM element. In this case, it refers to the button element in the DOM.


We expend further the `__reactFiber$hwiy9k0i6jt` and we obtain more details about the fiber node:

```
__reactFiber$hwiy9k0i6jt: FiberNode
  actualDuration: 0.19999998807907104
  actualStartTime: 1340
  alternate: null
  child: FiberNode {tag: 6, key: null, elementType: null, type: null
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

- `actualDuration`: It is the total time in ms spent in order to render the component and its descentdents.
- `actualStartTime`: It is the timestamp in ms when the rendering of the component started.

These information could be used in **performance profiling**. Let's continue with the other fiber data:

- `alternate`: It is the alternate version representing the new state of the tree. In this case it is null because we have the initial render and nothing triggered a change in the state, and hence no re-render is triggered. After clicking on the button to increment the counter, the counter value becomes 1, the state will be updated and a re-render is triggered. The alternate value becomes:

```
alternate: FiberNode
actualDuration: 0.09999999403953552
actualStartTime: 49094.09999999404
alternate: FiberNode {tag: 5, key: null, elementType: 'button', type: 'button', stateNode: button, …}
child: FiberNode {tag: 6, key: null, elementType: null, type: null, stateNode: text, …}
childLanes: 0
deletions: null
dependencies: null
elementType: "button"
flags: 4
index: 0
key: null
lanes: 0
memoizedProps: 
  children: Array(2)
  0: "count is "
  1: 1
  length: 2
.
.
.
```
- `child`: It points to the child of the button fiber, and in this case, it is the text node which has as value "count is" plus the counter value.
- `childLanes`: Lanes in React are a concept related to scheduling and concurrent mode. A lane is a way to mark work with priority, and in this case is `0` which indicates no specific priority. It is associated with a subtree of the fiber node.
- `deletions`: It represents any nodes marked for deletion during the most recent update, and in this case it is `null`.
- `dependencies`: It is related to the concurrent mode and tracking asynchronous updates. In this case, it is `null`.
- `flags`: They are used for internal bookkeeping. `0` means no flag is set.
- `index`: It represents the index of the fiber node in the parent's child list. 
- `lanes`: similar to `childLanes`.
- `memoizedProps`: It contains the props that were commited to the fiber in the last update. (In this example, it is an array of two values: `count is`, and `0` before clicking the button, and has `onClick` for the function `updateCounter).
       -  children:Array(2)
           0: "count is "
           1: 0
           length: 2
           [[Prototype]]: Array(0)
       -  onClick: ƒ updateCounter()
           length: 0
           name: "updateCounter"  
- `memoizedState`: It contains the state of the component that was commited in the last render.
- `mode`: It represents the rendering mode (Eg. `ConcurrentMode`)
- `pendingProps`: It contains the props which are about to be committed.
       -  children:Array(2)
           0: "count is "
           1: 0
           length: 2
           [[Prototype]]: Array(0)  
       -  onClick: ƒ updateCounter()
           length: 0
           name: "updateCounter"  
- `ref`: Is is `ref` used in a react elements, it indicates a reference to the underlying instance of a given component in order to access it or it underlying DOM element. In this example, it is `null` because ref was not attached to the `MyButton` component.           
- `return`: It points to the fiber parent node in the tree.  
- `selfBaseDuration`: It is the time the component takes to render itself, without its children.
- `sibling`: It points to the next sibling of the child of the fiber node. In this case it is `null` because only `button` is returned and it has no other siblings returned with it.
- `subtreeFlags`: It indicates some flags related to the subtree.
- `treeBaseDuration`: It is the time the component takes to render itself and its children.
- `updateQueue`: It contains the pending updates for the fiber node, used to manage state and props updates.

For more, check [React Fiber source code](https://github.com/facebook/react/blob/432b9f1d9729aaea010730d546bda89b9842eaa1/packages/react-reconciler/src/ReactFiber.js)

## Call stack on button click

When we click the button, the counter will be incremented, I tracked the stack on the browser, and here are the different functions that were called:

![Call stack](img/button_update_stack.png)

- `flushSyncCallbacks`:
- `performSyncWorkOnRoot`:
- `renderRootSnyc`:
- `workLoopSnyc`:
- `performUnitOfWork`:
- `beginWork$1`:
- `beginWork`:
- `updateFunctionComponent`:
- `renderWithHooks`:

