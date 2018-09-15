import { CONSTRUCT_BAR } from "../actions/barActions";

const initialState = {
  bar_data: [],
  svg_size: [1200,500]
}

const barReducer = (state=initialState, action) => {
  switch(action.type) {
    case CONSTRUCT_BAR:
      return state
    default:
      return state
  }
}

export default barReducer
