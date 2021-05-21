import axios from 'axios';
import { FARM_LIST_REQUEST, FARM_LIST_SUCCESS, FARM_LIST_FAIL } from '../constants/farmConstants';

export const listFarms = () => async (dispatch) => {
  try {
    dispatch({ type: FARM_LIST_REQUEST });

    const { data } = await axios.get('/api/farms/');

    dispatch({
      type: FARM_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FARM_LIST_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
