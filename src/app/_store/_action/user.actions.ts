import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/_models/user';

export const saveUser = createAction(
    '[User] Save User',
    (user: User) => ({user})
);




