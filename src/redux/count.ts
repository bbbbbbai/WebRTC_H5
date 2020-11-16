import { ICountType } from "./action/action"
import { ADD_COUNT } from "../constants"


const count = (state:number = 0, action: ICountType) => {
  switch (action.type) {
    case ADD_COUNT:
      state = action.count
      return state
    default:
      return state
  }
}

export default count
