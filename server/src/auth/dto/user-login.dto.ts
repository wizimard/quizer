import { Trim } from '@common/trim.decorator';
import { IsString, IsEmail, Length } from 'class-validator';

export class UserLoginDto {
	@IsString()
	@Trim()
	@IsEmail()
	email: string;

	@IsString()
	@Trim()
	@Length(8, 255)
	password: string;
}
