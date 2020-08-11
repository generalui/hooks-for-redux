import { getStore } from "../index";

it("registerReducers with the same name overrides - for Hot-reloading support", () => {
  getStore().registerReducers({"my-action-type": () => 1});
  getStore().registerReducers({"my-action-type": () => 2});
});
