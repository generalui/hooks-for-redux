import { getStore, setStore, createStore } from "../index";

it("works", () => {
  const store1 = getStore()
  const store2 = setStore(createStore({}))
  expect(store1 === store2).toEqual(false)
});
