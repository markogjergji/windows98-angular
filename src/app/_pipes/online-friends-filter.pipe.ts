import { Pipe, PipeTransform } from '@angular/core';
import { UserStatus } from '../_constants/enums';

@Pipe({
  name: 'onlineFriendsFilter'
})
export class OnlineFriendsFilterPipe implements PipeTransform {

    transform(users: any[], status: string) : any {

        return users ? users.filter(user => user.status ? user.status === status : false) : [];
    }

}
