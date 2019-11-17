module.exports.createVirtualStore = (store, storeKey) => {
  const getState = () => store.getState()[storeKey];
  return {
    getState,
    subscribe: f => {
      let lastState = getState();
      return store.subscribe(
        () => lastState !== getState() && f((lastState = getState()))
      );
    }
  };
};
