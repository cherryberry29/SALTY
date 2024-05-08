import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    PROJECT_CREATE_SUCCESS,
    PROJECT_CREATE_FAIL,
    LOGOUT,
    ISSUE_ADDED_Fail,
    ISSUE_ADDED_SUCCESS,
    PROJECT_CLICK_SUCCESS,
    PROJECT_CLICK_FAIL
   
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    project:null,
    error:null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case ISSUE_ADDED_SUCCESS:
                return {
                    ...state,
                    issue: action.payload
                    
                }
       
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
           
        case GOOGLE_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            // localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
       
        case LOGIN_SUCCESS:
       
        
       
            localStorage.setItem('access', payload.access);
            // localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
       
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload
            }
       
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null
            }
       
        case LOGIN_FAIL:
        case LOGOUT:
        case SIGNUP_FAIL:
        case GOOGLE_AUTH_FAIL: 
      
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }

            case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }


            case PASSWORD_RESET_SUCCESS:
            case PASSWORD_RESET_FAIL:
            case PASSWORD_RESET_CONFIRM_SUCCESS:
            case PASSWORD_RESET_CONFIRM_FAIL:
            case ACTIVATION_SUCCESS:
            case ACTIVATION_FAIL:
                    return {
                        ...state
                    }
            case  PROJECT_CREATE_SUCCESS:
            case  PROJECT_CLICK_SUCCESS:
            return {
                ...state,
                project: action.payload,
                error: null
            };
        case  PROJECT_CREATE_FAIL:
        case  PROJECT_CLICK_FAIL:

            return {
                ...state,
                error: action.payload
            };
        case  ISSUE_ADDED_Fail:
                return {
                    ...state,
                    error: action.payload
                };

        default:
            return state
    }
};