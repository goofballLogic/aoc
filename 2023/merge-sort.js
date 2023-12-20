import { test } from "./test.js";

export function sort(arr1, arr2, sortKey = x => x) {

    let index1 = 0;
    let index2 = 0;
    const result = [];
    let item1 = arr1[index1], item2 = arr2[index2];
    while (typeof item1 !== "undefined" || typeof item2 !== "undefined") {

        if (typeof item1 === "undefined") {

            result.push(item2);
            index2++;

        } else if (typeof item2 === "undefined") {

            result.push(item1);
            index1++;

        } else {

            if (sortKey(item1) > sortKey(item2)) {

                result.push(item2);
                index2++;

            } else {

                result.push(item1);
                index1++;

            }

        }
        item1 = arr1[index1];
        item2 = arr2[index2];

    }
    return result;

}

test("sort [1,3,5],[2,4,6]", [1, 2, 3, 4, 5, 6], () => sort([1, 3, 5], [2, 4, 6]));
test("sort [1,3,5],[2,4]", [1, 2, 3, 4, 5], () => sort([1, 3, 5], [2, 4]));
test("sort [1,3,5,7,9],[2,6]", [1, 2, 3, 5, 6, 7, 9], () => sort([1, 3, 5, 7, 9], [2, 6]));
test("sort [{x: 1}, {x: 3}], [{ x: 2 }]", [{ x: 1 }, { x: 2 }, { x: 3 }], () => sort([{ x: 1 }, { x: 3 }], [{ x: 2 }], x => x.x));
