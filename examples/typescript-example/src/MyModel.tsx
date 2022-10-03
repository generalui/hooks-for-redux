import { createReduxModule } from "hooks-for-redux";

export interface MyModelState {
  isOn: boolean;
}

const initialState: MyModelState = {
  isOn: false,
};

export const [use, { toggleIsOn }, store] = createReduxModule("myModel", initialState, {
  toggleIsOn: (state: MyModelState) => ({ isOn: !state.isOn }),
});
