import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/_models/user';

import * as UserActions from '../_action/user.actions';

export const userFeatureKey = 'user';

export interface UserState {
    user : User;
}

export const initialState: UserState = {
    user : {}
};

export const userReducer = createReducer(

    initialState,
    on(UserActions.saveUser,
        (state: UserState, user) => user)
);

export function reducer(state: UserState | undefined, action: Action) : any {

    return userReducer(state, action);

}