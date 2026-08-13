module.exports = {
	apps: [
		{
			name: 'quiz-server',
			script: 'pm2-entry.mjs',
			instances: Number(process.env.PM2_INSTANCES) || 4,
			exec_mode: 'cluster',
			// Sticky sessions so WebSocket upgrades stay on one worker
			sticky: true,
			autorestart: true,
			max_memory_restart: '512M',
		},
	],
};
