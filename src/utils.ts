export function sortBy<T, TProp>(arr: ReadonlyArray<T>, property: (item: T) => TProp): ReadonlyArray<T> {
	return arr.slice().sort((a, b) => {
		const aProp = property(a);
		const bProp = property(b);

		if (aProp < bProp) {
			return -1;
		} else if (aProp > bProp) {
			return 1;
		}
		return 0;
	});
}

export function uniqueBy<T, TUniqueVal>(
	arr: T[] | ReadonlyArray<T>,
	uniqueKeySelector: (item: T) => TUniqueVal,
): ReadonlyArray<T> {
	const uniqueValues = new Set();
	const res: T[] = [];

	arr.slice().forEach(v => {
		const key = uniqueKeySelector(v);
		if (uniqueValues.has(key)) {
			return;
		}
		uniqueValues.add(key);
		res.push(v);
	});

	return res;
}

export function groupBy<T, TKey, TValue>(
	arr: T[] | ReadonlyArray<T>,
	keySelector: (item: T) => TKey,
	valueSelector: (item: T) => TValue,
): Map<TKey, TValue[]> {
	const res = new Map();

	arr.slice().forEach(v => {
		const key = keySelector(v);
		let entry = res.get(key);
		if (entry == null) {
			entry = [];
			res.set(key, entry);
		}
		entry.push(valueSelector(v));
	});

	return res;
}
