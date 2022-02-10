import { Lock, LockFactory } from "../intf/lock.ts";
import { createPromise } from "./create-promise.ts";

export let lockFactory: LockFactory = {
	create(): Lock {	
		let isLocked = false;
		let outstandingPromises = [];

		return {
			/**
			 * Acquires the lock immediately.
			 */
			async acquire(callback: () => Promise<any>): Promise<any> {
				await (() => {
					if (!isLocked) {
						isLocked = true;
						return Promise.resolve();
					}
		
					let [promise, res, _rej] = createPromise();
					outstandingPromises.push(res);
					return promise;
				});

				let result = await callback();

				(async () => {
					if (outstandingPromises.length > 0) {
						let resolve = outstandingPromises.shift();
						resolve();
					} else {
						isLocked = false;
					}
				})();

				return result;
			},

			/**
			 * Attemps to aquire the lock within the same JavaScript event loop.
			 * The passed callback is always invoked, with a success boolean passed through to indicate whether the lock has been acquired.
			 */
			async acquireImmediately(callback: (success: boolean) => Promise<any>): Promise<any> {
				if (isLocked) {
					return await callback(false);
				} else {
					isLocked = true;
					let result = await callback(true);

					(async () => {
						if (outstandingPromises.length > 0) {
							let resolve = outstandingPromises.shift();
							resolve();
						} else {
							isLocked = false;
						}
					})();

					return result;
				}
			},
		};
	},
};

export let createLock = lockFactory.create;

// TODO: deadlocks and other important things.
