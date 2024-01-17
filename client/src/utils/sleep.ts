function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep<T>(callback: () => T, delay = 1000): Promise<T> {
	await timeout(delay);
	return callback();
}

export { sleep };
