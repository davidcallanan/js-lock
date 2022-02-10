export interface Lock {
	/**
	 * Calls the passed in function when the lock can be acquired, and releases the lock on completion of that function.
	 * The promise resolves when the lock has been released, along with the data returned by the callback.
	 */
	acquire(callback: () => Promise<any>): Promise<any>;
	
	/**
	 * Calls the passed in function when the lock can be acquired, and releases the lock on completion of that function.
	 * The callback functon is a generator.
	 * Returns a channel which receives data pushed out by the callback function.
	 * The promise resolves when the lock has been released, along with the data returned by the callback.
	 */
	acquireWithChannel(callback: () => AsyncIterableIterator<any>): AsyncIterableIterator<any>;
	
	/**
	 * Immediately invokes callback and passes in true if the lock could be acquired, otherwise false.
	 * If the lock was acquired, the lock is released on completion of the callback.
	 * Returns true if the lock could be acquired immediately, otherwise false, upon completion of the passed in function.
	 */
	acquireImmediately(callback: (success: boolean) => Promise<any>): Promise<any>;

	// TODO: acquireMultiple?
	// TODO: acquireAll?
}

export interface LockFactory {
	create(): Lock;
}
