export const createDebugger = (debug: boolean) => {
  if (!debug) {
    // If debug is false, return a no-op function
    return () => {};
  }

  // If debug is true, return a logging function
  return (message: string) => {
    console.log('%c [MONERIUM:DEBUG]:', 'color:orange;', message);
  };
};
