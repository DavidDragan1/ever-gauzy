import * as path from 'path';
import * as chalk from 'chalk';
import { TlsOptions } from 'tls';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { parseToBoolean } from '@gauzy/common';

let dbType: string;

if (process.env.DB_TYPE) dbType = process.env.DB_TYPE;
else dbType = 'sqlite';

console.log(`Selected DB Type (DB_TYPE env var): ${dbType}`);
console.log('DB Synchronize: ' + process.env.DB_SYNCHRONIZE);

// `process` is a built-in global in Node.js, no need to `require()`
console.log(chalk.magenta(`Currently running Node.js version %s`), process.version);

let connectionConfig: TypeOrmModuleOptions;
let dbPoolSize: number;
let dbConnectionTimeout: number;
let idleTimeoutMillis: number;
let dbSlowQueryLoggingTimeout: number;

const getTlsOptions = (dbSslMode: string): TlsOptions | undefined => {
	if (!parseToBoolean(dbSslMode)) return undefined;

	const base64data = process.env.DB_CA_CERT;
	const buff = Buffer.from(base64data, 'base64');
	const sslCert = buff.toString('ascii');
	return {
		rejectUnauthorized: true,
		ca: sslCert
	};
}

switch (dbType) {
	case 'mongodb':
		throw 'MongoDB not supported yet';

	case 'mysql':
		dbPoolSize = process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 80;
		dbConnectionTimeout = process.env.DB_CONNECTION_TIMEOUT
			? parseInt(process.env.DB_CONNECTION_TIMEOUT)
			: 5000; // 5 seconds default
		idleTimeoutMillis = process.env.DB_IDLE_TIMEOUT ? parseInt(process.env.DB_IDLE_TIMEOUT) : 10000; // 10 seconds
		dbSlowQueryLoggingTimeout = process.env.DB_SLOW_QUERY_LOGGING_TIMEOUT
			? parseInt(process.env.DB_SLOW_QUERY_LOGGING_TIMEOUT)
			: 10000; // 10 seconds default

		console.log('DB Pool Size: ' + dbPoolSize);
		console.log('DB Connection Timeout: ' + dbConnectionTimeout);
		console.log('DB Idle Timeout: ' + idleTimeoutMillis);
		console.log('DB Slow Query Logging Timeout: ' + dbSlowQueryLoggingTimeout);

		const mysqlConnectionOptions: MysqlConnectionOptions = {
			type: dbType,
			ssl: getTlsOptions(process.env.DB_SSL_MODE),
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
			database: process.env.DB_NAME || 'mysql',
			username: process.env.DB_USER || 'root',
			password: process.env.DB_PASS || 'root',
			// forcing typeorm to use (mysql2) if both (mysql/mysql2) packages found, it prioritize to load (mysql)
			connectorPackage: 'mysql2',
			logging:
				process.env.DB_LOGGING == 'false'
					? false
					: process.env.DB_LOGGING == 'all'
					? 'all'
					: process.env.DB_LOGGING == 'query'
					? ['query', 'error']
					: ['error'], // by default set to error only
			logger: 'advanced-console',
			// log queries that take more than 10 sec as warnings
			maxQueryExecutionTime: dbSlowQueryLoggingTimeout,
			synchronize: process.env.DB_SYNCHRONIZE === 'true', // We are using migrations, synchronize should be set to false.
			poolSize: dbPoolSize,
			migrations: ['src/modules/not-exists/*.migration{.ts,.js}'],
			entities: ['src/modules/not-exists/*.entity{.ts,.js}'],
			extra: {
				connectionLimit: 10,
				maxIdle: 10
			}
		}

		connectionConfig = mysqlConnectionOptions;
		break;

	case 'postgres':

		// We set default pool size as 80. Usually PG has 100 connections max by default.
		dbPoolSize = process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 80;

		dbConnectionTimeout = process.env.DB_CONNECTION_TIMEOUT
			? parseInt(process.env.DB_CONNECTION_TIMEOUT)
			: 5000; // 5 seconds default

		idleTimeoutMillis = process.env.DB_IDLE_TIMEOUT ? parseInt(process.env.DB_IDLE_TIMEOUT) : 10000; // 10 seconds

		dbSlowQueryLoggingTimeout = process.env.DB_SLOW_QUERY_LOGGING_TIMEOUT
			? parseInt(process.env.DB_SLOW_QUERY_LOGGING_TIMEOUT)
			: 10000; // 10 seconds default

		console.log('DB Pool Size: ' + dbPoolSize);
		console.log('DB Connection Timeout: ' + dbConnectionTimeout);
		console.log('DB Idle Timeout: ' + idleTimeoutMillis);
		console.log('DB Slow Query Logging Timeout: ' + dbSlowQueryLoggingTimeout);

		const postgresConnectionOptions: PostgresConnectionOptions = {
			type: dbType,
			ssl: getTlsOptions(process.env.DB_SSL_MODE),
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
			database: process.env.DB_NAME || 'postgres',
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASS || 'root',
			logging:
				process.env.DB_LOGGING == 'false'
					? false
					: process.env.DB_LOGGING == 'all'
					? 'all'
					: process.env.DB_LOGGING == 'query'
					? ['query', 'error']
					: ['error'], // by default set to error only
			logger: 'advanced-console',
			// log queries that take more than 10 sec as warnings
			maxQueryExecutionTime: dbSlowQueryLoggingTimeout,
			synchronize: process.env.DB_SYNCHRONIZE === 'true', // We are using migrations, synchronize should be set to false.
			uuidExtension: 'pgcrypto',
			migrations: ['src/modules/not-exists/*.migration{.ts,.js}'],
			entities: ['src/modules/not-exists/*.entity{.ts,.js}'],
			// See https://typeorm.io/data-source-options#common-data-source-options
			poolSize: dbPoolSize,
			extra: {
				// based on  https://node-postgres.com/apis/pool max connection pool size
				max: dbPoolSize,
				minConnection: 10,
				maxConnection: dbPoolSize,
				poolSize: dbPoolSize,
				// connection timeout - number of milliseconds to wait before timing out when connecting a new client
				connectionTimeoutMillis: dbConnectionTimeout,
				// number of milliseconds a client must sit idle in the pool and not be checked out
				// before it is disconnected from the backend and discarded
				idleTimeoutMillis: idleTimeoutMillis
			}
		};

		connectionConfig = postgresConnectionOptions;

		break;

	case 'sqlite':
		const dbPath = process.env.DB_PATH || path.join(process.cwd(), ...['apps', 'api', 'data'], 'gauzy.sqlite3');

		console.log('Sqlite DB Path: ' + dbPath);

		const sqliteConfig: DataSourceOptions = {
			type: dbType,
			database: dbPath,
			logging: 'all',
			logger: 'file', //Removes console logging, instead logs all queries in a file ormlogs.log
			synchronize: process.env.DB_SYNCHRONIZE === 'true' // We are using migrations, synchronize should be set to false.
		};

		connectionConfig = sqliteConfig;

		break;

	case 'better-sqlite3':
		const betterSqlitePath =
			process.env.DB_PATH || path.join(process.cwd(), ...['apps', 'api', 'data'], 'gauzy.sqlite3');

		console.log('Better Sqlite DB Path: ' + betterSqlitePath);

		const betterSqliteConfig: DataSourceOptions = {
			type: dbType,
			database: betterSqlitePath,
			logging: 'all',
			logger: 'file', // Removes console logging, instead logs all queries in a file ormlogs.log
			synchronize: process.env.DB_SYNCHRONIZE === 'true', // We are using migrations, synchronize should be set to false.
			prepareDatabase: (db) => {
				if (!process.env.IS_ELECTRON) {
					// Enhance performance
					db.pragma('journal_mode = WAL');
				}
			}
		};

		connectionConfig = betterSqliteConfig;

		break;
}

export const dbConnectionConfig = connectionConfig;
