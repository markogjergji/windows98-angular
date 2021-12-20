import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

    transform(users: any[], filterText: string, loggedUserId:string|undefined): any {
        if(loggedUserId)
        return users ? users.filter(user => (user && user.username && user.friends) ? user.username.includes(filterText) && !user.friends.includes(loggedUserId) : false) : [];
    }

}
