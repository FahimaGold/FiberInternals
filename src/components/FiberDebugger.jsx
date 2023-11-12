import React, { useEffect } from "react";

export function FiberDebugger(){
    useEffect(() => {
        console.log('Fiber tree:', React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner);
      });
      return <div>Hello from FiberDebugger</div>;
}
