import { getStore } from "../index";

it("injectReducer key must be unique", () => {
  getStore().injectReducer("myKey", () => 1);
  expect(() => getStore().injectReducer("myKey", () => 2)).toThrow();
});
