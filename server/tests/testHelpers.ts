export const arraysAreEqual = (array1: unknown[], array2: unknown[]): Boolean => {
	if (array1.length !== array2.length) {
		return false
	}
	let sorteda1 = array1.sort()
	let sorteda2 = array2.sort()
	return sorteda1.every((val, ind) => val === sorteda2[ind])

}