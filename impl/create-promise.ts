export function createPromise<T>(): [Promise<T>, (data: T) => void, (error: any) => void] {
	let res: (data: T) => void, rej: (error: any) => void;
	let promise = new Promise((res_: (data: T) => void, rej_ : (error: any) => void) => {
		res = res_;
		rej = rej_;
	});
	return [promise, res, rej];
}
