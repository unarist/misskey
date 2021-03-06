/**
 * Misskey Entry Point!
 */

Error.stackTraceLimit = Infinity;

import * as fs from 'fs';
import * as os from 'os';
import * as cluster from 'cluster';
import * as debug from 'debug';
import chalk from 'chalk';
// import portUsed = require('tcp-port-used');
import isRoot = require('is-root');
import { master } from 'accesses';
import Xev from 'xev';

import Logger from './utils/logger';
import ProgressBar from './utils/cli/progressbar';
import EnvironmentInfo from './utils/environmentInfo';
import MachineInfo from './utils/machineInfo';
import DependencyInfo from './utils/dependencyInfo';
import stats from './utils/stats';

import { Config, path as configPath } from './config';
import loadConfig from './config';

const clusterLog = debug('misskey:cluster');
const ev = new Xev();

process.title = 'Misskey';

// Start app
main();

/**
 * Init process
 */
function main() {
	if (cluster.isMaster) {
		masterMain();

		ev.mount();
		stats();
	} else {
		workerMain();
	}
}

/**
 * Init master process
 */
async function masterMain() {
	let config: Config;

	try {
		// initialize app
		config = await init();
	} catch (e) {
		console.error(e);
		Logger.error(chalk.red('Fatal error occurred during initializing :('));
		process.exit(1);
	}

	Logger.info(chalk.green('Successfully initialized :)'));

	// Init accesses
	if (config.accesses && config.accesses.enable) {
		master();
	}

	spawnWorkers(() => {
		Logger.info(chalk.bold.green(
			`Now listening on port ${chalk.underline(config.port.toString())}`));

		Logger.info(chalk.bold.green(config.url));
	});
}

/**
 * Init worker process
 */
function workerMain() {
	// start server
	require('./server');
}

/**
 * Init app
 */
async function init(): Promise<Config> {
	Logger.info('Welcome to Misskey!');
	Logger.info('Initializing...');

	EnvironmentInfo.show();
	MachineInfo.show();
	new DependencyInfo().showAll();

	const configLogger = new Logger('Config');
	if (!fs.existsSync(configPath)) {
		throw 'Configuration not found - Please run "npm run config" command.';
	}

	const config = loadConfig();

	configLogger.info('Successfully loaded');
	configLogger.info(`maintainer: ${config.maintainer}`);

	if (process.platform === 'linux' && !isRoot() && config.port < 1024) {
		throw 'You need root privileges to listen on port below 1024 on Linux';
	}

	// Check if a port is being used
	/* https://github.com/stdarg/tcp-port-used/issues/3
	if (await portUsed.check(config.port)) {
		throw `Port ${config.port} is already used`;
	}
	*/

	// Try to connect to MongoDB
	const mongoDBLogger = new Logger('MongoDB');
	const db = require('./db/mongodb').default;
	mongoDBLogger.info('Successfully connected');
	db.close();

	return config;
}

function spawnWorkers(onComplete: Function) {
	// Count the machine's CPUs
	const cpuCount = os.cpus().length;

	const progress = new ProgressBar(cpuCount, 'Starting workers');

	// Create a worker for each CPU
	for (let i = 0; i < cpuCount; i++) {
		const worker = cluster.fork();
		worker.on('message', message => {
			if (message === 'ready') {
				progress.increment();
			}
		});
	}

	// On all workers started
	progress.on('complete', () => {
		onComplete();
	});
}

// Listen new workers
cluster.on('fork', worker => {
	clusterLog(`Process forked: [${worker.id}]`);
});

// Listen online workers
cluster.on('online', worker => {
	clusterLog(`Process is now online: [${worker.id}]`);
});

// Listen for dying workers
cluster.on('exit', worker => {
	// Replace the dead worker,
	// we're not sentimental
	clusterLog(chalk.red(`[${worker.id}] died :(`));
	cluster.fork();
});

// Display detail of unhandled promise rejection
process.on('unhandledRejection', console.dir);

// Dying away...
process.on('exit', () => {
	Logger.info('The process is going exit');
});
