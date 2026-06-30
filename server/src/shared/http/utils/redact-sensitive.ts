const DEFAULT_SENSITIVE_KEYS = ['password', 'refreshToken'] as const;

export function redactSensitive<T>(value: T, sensitiveKeys: readonly string[] = DEFAULT_SENSITIVE_KEYS): T {
	if (value === null || value === undefined || typeof value !== 'object') {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => redactSensitive(item, sensitiveKeys)) as T;
	}

	const result: Record<string, unknown> = {};

	for (const [key, nestedValue] of Object.entries(value)) {
		if (sensitiveKeys.includes(key)) {
			result[key] = '[REDACTED]';
			continue;
		}

		result[key] = redactSensitive(nestedValue, sensitiveKeys);
	}

	return result as T;
}
