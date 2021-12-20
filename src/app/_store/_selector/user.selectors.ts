import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from '../_reducer/user.reducer';

export const selectUserState = createFeatureSelector<fromUser.UserState>(
    
      fromUser.userFeatureKey,
    
);

export const selectUser = createSelector(
    
      selectUserState,
    
      (state: fromUser.UserState) => state.user
    
);
