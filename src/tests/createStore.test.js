import { getStore } from "../index";

it("injectReducer key must be unique", () => {
  getStore().injectReducer("myKey", () => 1);
  getStore().injectReducer("myKey", () => 2); // second call OK
});
