import bcrypt from 'bcrypt';

export function hash(data: string): Promise<string> {
	return bcrypt.hash(data, parseInt(process.env.HASH_SALT ?? ''));
}

export function verifyHash(data: string, hash: string): Promise<boolean> {
	return bcrypt.compare(data, hash);
}
