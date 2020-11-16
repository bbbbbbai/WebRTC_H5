import { Dispatch } from "redux";
import { ADD_COUNT } from "../../constants";

export interface ICountType {
  type: String;
  count: number;
}

export const addCount = (count: number): ICountType => ({
  type: ADD_COUNT,
  count,
});
export const setCountSync = (count: number) => async (dispatch: Dispatch) => {
  await apiAdd();
  dispatch(addCount(count));
  return "ok";
};

function apiAdd() {
  return true;
}
