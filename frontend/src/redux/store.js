import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  userLoginReducer,
  userRegisterReducer,
  userEmailConfirmReducer,
  userEmailResendReducer,
  userPictureUpdateReducer,
  userProjectBgUpdateReducer,
} from './reducers/userReducers';
import {
  projectCreateReducer,
  projectSetCurrentReducer,
  projectGetDataReducer,
  projectTaskMoveReducer,
  projectFindUsersReducer,
  projectSetTaskReducer,
  projectToDoVisibilityReducer,
  projectMessagesReducer,
} from './reducers/projectReducers';
import { socketConnectionReducer } from './reducers/socketReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userEmailConfirm: userEmailConfirmReducer,
  userEmailResend: userEmailResendReducer,
  userPictureUpdate: userPictureUpdateReducer,
  userProjectBgUpdate: userProjectBgUpdateReducer,
  projectCreate: projectCreateReducer,
  projectSetCurrent: projectSetCurrentReducer,
  projectGetData: projectGetDataReducer,
  projectTaskMove: projectTaskMoveReducer,
  projectFindUsers: projectFindUsersReducer,
  projectSetTask: projectSetTaskReducer,
  projectToDoVisibility: projectToDoVisibilityReducer,
  projectMessages: projectMessagesReducer,
  socketConnection: socketConnectionReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;
const toDoListVisibilityFromStorage = localStorage.getItem('toDoListIds')
  ? JSON.parse(localStorage.getItem('toDoListIds'))
  : [];

const initialState = {
  userLogin: {
    userInfo: userInfoFromStorage,
    loading: userInfoFromStorage && userInfoFromStorage.token ? true : false,
  },
  projectToDoVisibility: { listIds: toDoListVisibilityFromStorage },
};

const middleware = [thunk];

const createStore = reduxCreateStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default createStore;
