// cartesian-product by izaakschroeder
// Licensed under the CC0-1.0
// https://github.com/izaakschroeder/cartesian-product
// https://github.com/izaakschroeder/cartesian-product/blob/master/lib/product.js
// Adapted to TypeScript by OSA413, you can use it under the same license


// If you pass (A[], B[], C[], D[], ...)
// It should return [[A, B, C, D, ...], [A, B, C, D, ...], ...] as type

export class CartesianProduct {
    static product<T1>(elements1: T1[]): [T1][]
    static product<T1, T2>(elements1: T1[], elements2: T2[]): [T1, T2][]
    static product<T1, T2, T3>(elem1: T1[], elem2: T2[], elem3: T3[]): [T1, T2, T3][]
    static product<T1, T2, T3, T4>(elem1: T1[], elem2: T2[], elem3: T3[], elem4: T4[]): [T1, T2, T3, T4][]
    static product<T1, T2, T3, T4, T5>(elem1: T1[], elem2: T2[], elem3: T3[], elem4: T4[], elem5: T5[]): [T1, T2, T3, T4, T5][]
    static product<T1, T2, T3, T4, T5, T6>(elem1: T1[], elem2: T2[], elem3: T3[], elem4: T4[], elem5: T5[], elem6: T6[]): [T1, T2, T3, T4, T5, T6][]

    static product<T extends Array<unknown>>(...elements: T[]): T[] {
        if (!Array.isArray(elements)) {
            throw new TypeError();
        }
        
        const end = elements.length - 1;
        const result = [];

        function addTo(curr: T[], start: number) {
            const first = elements[start];
            const last = (start === end);

            for (let i = 0; i < first.length; ++i) {
                const copy = curr.slice();
                copy.push(first[i] as T);

                if (last) {
                    result.push(copy);
                } else {
                    addTo(copy, start + 1);
                }
            }
        }
        
        if (elements.length) {
            addTo([], 0);
        } else {
            result.push([]);
        }
        return result as T[];
    }
}