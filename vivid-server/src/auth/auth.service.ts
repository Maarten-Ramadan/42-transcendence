import { Injectable, Inject } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserService)
		private userService: UserService
	) {}

    async validateUser(data: { id: number, login: string }): Promise<any> {
		let user = await this.userService.findIntraUser(data.id.toString());

		if (!user) {
            user = await this.userService.createUser(data);
		}

		return user;
	}
}
