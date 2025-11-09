export interface TestCase {
    args: unknown[]
    result: unknown
}

export interface Question {
    question: string
    testCases: TestCase[]
}

export const questions: Question[] = [
    {
        question: 'Write a function f(a, b) that returns the sum of two numbers.',
        testCases: [
            { args: [2, 3], result: 5 },
            { args: [0, 0], result: 0 },
            { args: [-1, 1], result: 0 },
            { args: [100, -50], result: 50 },
            { args: [0.5, 0.3], result: 0.8 }
        ]
    },
    {
        question: 'Write a function f(str) that reverses a string.',
        testCases: [
            { args: ['hello'], result: 'olleh' },
            { args: [''], result: '' },
            { args: ['a'], result: 'a' },
            { args: ['racecar'], result: 'racecar' },
            { args: ['12345'], result: '54321' }
        ]
    },
    {
        question: 'Write a function f(str) that checks if a string is a palindrome (reads the same forwards and backwards).',
        testCases: [
            { args: ['racecar'], result: true },
            { args: ['hello'], result: false },
            { args: [''], result: true },
            { args: ['a'], result: true },
            { args: ['Aa'], result: false },
            { args: ['madam'], result: true }
        ]
    },
    {
        question: 'Write a function f(n) that calculates the factorial of a number (n! = n * (n-1) * ... * 1).',
        testCases: [
            { args: [5], result: 120 },
            { args: [0], result: 1 },
            { args: [1], result: 1 },
            { args: [3], result: 6 },
            { args: [7], result: 5040 }
        ]
    },
    {
        question: 'Write a function f(n) that returns the nth Fibonacci number (0, 1, 1, 2, 3, 5, 8, ...).',
        testCases: [
            { args: [0], result: 0 },
            { args: [1], result: 1 },
            { args: [2], result: 1 },
            { args: [6], result: 8 },
            { args: [10], result: 55 }
        ]
    },
    {
        question: 'Write a function f(arr) that finds the maximum number in an array.',
        testCases: [
            { args: [[1, 3, 2]], result: 3 },
            { args: [[-1, -3, -2]], result: -1 },
            { args: [[42]], result: 42 },
            { args: [[1, 100, 2, 50]], result: 100 },
            { args: [[0, 0, 0]], result: 0 }
        ]
    },
    {
        question: 'Write a function f(n) that checks if a number is prime (only divisible by 1 and itself).',
        testCases: [
            { args: [2], result: true },
            { args: [3], result: true },
            { args: [4], result: false },
            { args: [17], result: true },
            { args: [1], result: false },
            { args: [25], result: false }
        ]
    },
    {
        question: 'Write a function f(str) that counts the number of vowels (a, e, i, o, u) in a string.',
        testCases: [
            { args: ['hello'], result: 2 },
            { args: [''], result: 0 },
            { args: ['aeiou'], result: 5 },
            { args: ['xyz'], result: 0 },
            { args: ['Programming'], result: 3 },
            { args: ['HELLO'], result: 2 }
        ]
    },
    {
        question: 'Write a function f(arr) that removes duplicate values from an array.',
        testCases: [
            { args: [[1, 2, 2, 3]], result: [1, 2, 3] },
            { args: [[]], result: [] },
            { args: [[1, 1, 1]], result: [1] },
            { args: [[1, 2, 3]], result: [1, 2, 3] },
            { args: [['a', 'b', 'a', 'c']], result: ['a', 'b', 'c'] }
        ]
    },
    {
        question: 'Write a function f(str) that capitalizes the first letter of each word in a string.',
        testCases: [
            { args: ['hello world'], result: 'Hello World' },
            { args: [''], result: '' },
            { args: ['a'], result: 'A' },
            { args: ['the quick brown fox'], result: 'The Quick Brown Fox' },
            { args: ['already Capitalized'], result: 'Already Capitalized' }
        ]
    },
    {
        question: 'Write a function f(arr) that sorts an array of numbers in ascending order.',
        testCases: [
            { args: [[3, 1, 4, 1, 5]], result: [1, 1, 3, 4, 5] },
            { args: [[]], result: [] },
            { args: [[42]], result: [42] },
            { args: [[-1, -3, 0, 2]], result: [-3, -1, 0, 2] },
            { args: [[5, 5, 5]], result: [5, 5, 5] }
        ]
    },
    {
        question: 'Write a function f(str) that checks if a string contains only digits.',
        testCases: [
            { args: ['123'], result: true },
            { args: ['abc'], result: false },
            { args: [''], result: false },
            { args: ['123abc'], result: false },
            { args: ['0'], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the second largest number in an array.',
        testCases: [
            { args: [[1, 3, 2, 5, 4]], result: 4 },
            { args: [[10, 10, 9]], result: 9 },
            { args: [[1, 1]], result: 1 },
            { args: [[5]], result: 5 },
            { args: [[-1, -5, -3]], result: -3 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the most frequent character in a string.',
        testCases: [
            { args: ['hello'], result: 'l' },
            { args: ['abcabc'], result: 'a' },
            { args: ['a'], result: 'a' },
            { args: ['programming'], result: 'r' },
            { args: ['aabbcc'], result: 'a' }
        ]
    },
    {
        question: 'Write a function f(arr) that flattens a nested array one level deep.',
        testCases: [
            { args: [[[1, 2], [3, 4]]], result: [1, 2, 3, 4] },
            { args: [[[1], [2, 3], [4, 5, 6]]], result: [1, 2, 3, 4, 5, 6] },
            { args: [[[]]], result: [] },
            { args: [[[1, [2, 3]], [4]]], result: [1, [2, 3], 4] },
            { args: [[[1, 2, 3]]], result: [1, 2, 3] }
        ]
    },
    {
        question: 'Write a function f(n) that returns true if n is a perfect square.',
        testCases: [
            { args: [16], result: true },
            { args: [15], result: false },
            { args: [0], result: true },
            { args: [1], result: true },
            { args: [100], result: true }
        ]
    },
    {
        question: 'Write a function f(str) that returns the longest word in a sentence.',
        testCases: [
            { args: ['The quick brown fox'], result: 'quick' },
            { args: ['Hello world'], result: 'Hello' },
            { args: ['a'], result: 'a' },
            { args: ['Programming is fun'], result: 'Programming' },
            { args: [''], result: '' }
        ]
    },
    {
        question: 'Write a function f(arr1, arr2) that returns the intersection of two arrays.',
        testCases: [
            { args: [[1, 2, 3], [2, 3, 4]], result: [2, 3] },
            { args: [['a', 'b'], ['b', 'c']], result: ['b'] },
            { args: [[1, 2], [3, 4]], result: [] },
            { args: [[], [1, 2]], result: [] },
            { args: [[1, 1, 2], [1, 2, 2]], result: [1, 2] }
        ]
    },
    {
        question: 'Write a function f(n) that returns the sum of digits in a number.',
        testCases: [
            { args: [123], result: 6 },
            { args: [0], result: 0 },
            { args: [9], result: 9 },
            { args: [999], result: 27 },
            { args: [1001], result: 2 }
        ]
    },
    {
        question: 'Write a function f(str) that checks if all characters in a string are unique.',
        testCases: [
            { args: ['abc'], result: true },
            { args: ['hello'], result: false },
            { args: [''], result: true },
            { args: ['a'], result: true },
            { args: ['abcdefg'], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the product of all numbers in an array.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: 24 },
            { args: [[2, 5]], result: 10 },
            { args: [[0, 1, 2]], result: 0 },
            { args: [[-1, 2, -3]], result: 6 },
            { args: [[1]], result: 1 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the number of words in a string.',
        testCases: [
            { args: ['hello world'], result: 2 },
            { args: [''], result: 0 },
            { args: ['one'], result: 1 },
            { args: ['a b c d e'], result: 5 },
            { args: ['  hello   world  '], result: 2 }
        ]
    },
    {
        question: 'Write a function f(n) that returns true if n is an even number.',
        testCases: [
            { args: [4], result: true },
            { args: [5], result: false },
            { args: [0], result: true },
            { args: [-2], result: true },
            { args: [-3], result: false }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the average of numbers in an array.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: 2.5 },
            { args: [[10, 20]], result: 15 },
            { args: [[5]], result: 5 },
            { args: [[-1, 1]], result: 0 },
            { args: [[0, 0, 0]], result: 0 }
        ]
    },
    {
        question: 'Write a function f(str) that removes all spaces from a string.',
        testCases: [
            { args: ['hello world'], result: 'helloworld' },
            { args: [''], result: '' },
            { args: ['no spaces'], result: 'nospaces' },
            { args: ['   '], result: '' },
            { args: ['a b c'], result: 'abc' }
        ]
    },
    {
        question: 'Write a function f(n) that returns the absolute value of a number.',
        testCases: [
            { args: [5], result: 5 },
            { args: [-5], result: 5 },
            { args: [0], result: 0 },
            { args: [-100], result: 100 },
            { args: [3.14], result: 3.14 }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the first element of an array.',
        testCases: [
            { args: [[1, 2, 3]], result: 1 },
            { args: [['a', 'b']], result: 'a' },
            { args: [[42]], result: 42 },
            { args: [[null, 1]], result: null },
            { args: [[undefined, 'x']], result: undefined }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the last element of an array.',
        testCases: [
            { args: [[1, 2, 3]], result: 3 },
            { args: [['a', 'b']], result: 'b' },
            { args: [[42]], result: 42 },
            { args: [[1, null]], result: null },
            { args: [['x', undefined]], result: undefined }
        ]
    },
    {
        question: 'Write a function f(str) that converts a string to uppercase.',
        testCases: [
            { args: ['hello'], result: 'HELLO' },
            { args: ['WORLD'], result: 'WORLD' },
            { args: [''], result: '' },
            { args: ['MiXeD'], result: 'MIXED' },
            { args: ['123abc'], result: '123ABC' }
        ]
    },
    {
        question: 'Write a function f(str) that converts a string to lowercase.',
        testCases: [
            { args: ['HELLO'], result: 'hello' },
            { args: ['world'], result: 'world' },
            { args: [''], result: '' },
            { args: ['MiXeD'], result: 'mixed' },
            { args: ['ABC123'], result: 'abc123' }
        ]
    },
    {
        question: 'Write a function f(arr, n) that returns the first n elements of an array.',
        testCases: [
            { args: [[1, 2, 3, 4, 5], 3], result: [1, 2, 3] },
            { args: [['a', 'b'], 1], result: ['a'] },
            { args: [[1, 2], 5], result: [1, 2] },
            { args: [[], 2], result: [] },
            { args: [[1, 2, 3], 0], result: [] }
        ]
    },
    {
        question: 'Write a function f(arr, n) that returns the last n elements of an array.',
        testCases: [
            { args: [[1, 2, 3, 4, 5], 3], result: [3, 4, 5] },
            { args: [['a', 'b'], 1], result: ['b'] },
            { args: [[1, 2], 5], result: [1, 2] },
            { args: [[], 2], result: [] },
            { args: [[1, 2, 3], 0], result: [] }
        ]
    },
    {
        question: 'Write a function f(str) that checks if a string starts with a specific character.',
        testCases: [
            { args: ['hello', 'h'], result: true },
            { args: ['world', 'w'], result: true },
            { args: ['test', 'x'], result: false },
            { args: ['', 'a'], result: false },
            { args: ['a', 'a'], result: true }
        ]
    },
    {
        question: 'Write a function f(str) that checks if a string ends with a specific character.',
        testCases: [
            { args: ['hello', 'o'], result: true },
            { args: ['world', 'd'], result: true },
            { args: ['test', 'x'], result: false },
            { args: ['', 'a'], result: false },
            { args: ['a', 'a'], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns true if an array is empty.',
        testCases: [
            { args: [[]], result: true },
            { args: [[1]], result: false },
            { args: [[null]], result: false },
            { args: [[undefined]], result: false },
            { args: [['', '', '']], result: false }
        ]
    },
    {
        question: 'Write a function f(n) that returns the square of a number.',
        testCases: [
            { args: [3], result: 9 },
            { args: [0], result: 0 },
            { args: [-4], result: 16 },
            { args: [0.5], result: 0.25 },
            { args: [10], result: 100 }
        ]
    },
    {
        question: 'Write a function f(n) that returns the cube of a number.',
        testCases: [
            { args: [3], result: 27 },
            { args: [0], result: 0 },
            { args: [-2], result: -8 },
            { args: [1], result: 1 },
            { args: [5], result: 125 }
        ]
    },
    {
        question: 'Write a function f(arr) that checks if an array contains a specific value.',
        testCases: [
            { args: [[1, 2, 3], 2], result: true },
            { args: [['a', 'b'], 'c'], result: false },
            { args: [[], 1], result: false },
            { args: [[null], null], result: true },
            { args: [[0], false], result: false }
        ]
    },
    {
        question: 'Write a function f(str) that returns the first character of a string.',
        testCases: [
            { args: ['hello'], result: 'h' },
            { args: ['a'], result: 'a' },
            { args: ['world'], result: 'w' },
            { args: ['123'], result: '1' },
            { args: [' test'], result: ' ' }
        ]
    },
    {
        question: 'Write a function f(str) that returns the last character of a string.',
        testCases: [
            { args: ['hello'], result: 'o' },
            { args: ['a'], result: 'a' },
            { args: ['world'], result: 'd' },
            { args: ['123'], result: '3' },
            { args: ['test '], result: ' ' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the length of an array.',
        testCases: [
            { args: [[1, 2, 3]], result: 3 },
            { args: [[]], result: 0 },
            { args: [['a']], result: 1 },
            { args: [[null, undefined]], result: 2 },
            { args: [[1, 2, 3, 4, 5]], result: 5 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the length of a string.',
        testCases: [
            { args: ['hello'], result: 5 },
            { args: [''], result: 0 },
            { args: ['a'], result: 1 },
            { args: ['hello world'], result: 11 },
            { args: ['123456'], result: 6 }
        ]
    },
    {
        question: 'Write a function f(n) that returns true if n is positive.',
        testCases: [
            { args: [5], result: true },
            { args: [-3], result: false },
            { args: [0], result: false },
            { args: [0.1], result: true },
            { args: [-0.1], result: false }
        ]
    },
    {
        question: 'Write a function f(n) that returns true if n is negative.',
        testCases: [
            { args: [-5], result: true },
            { args: [3], result: false },
            { args: [0], result: false },
            { args: [-0.1], result: true },
            { args: [0.1], result: false }
        ]
    },
    {
        question: 'Write a function f(str, char) that counts occurrences of a character in a string.',
        testCases: [
            { args: ['hello', 'l'], result: 2 },
            { args: ['programming', 'r'], result: 2 },
            { args: ['test', 'x'], result: 0 },
            { args: ['', 'a'], result: 0 },
            { args: ['aaa', 'a'], result: 3 }
        ]
    },
    {
        question: 'Write a function f(arr) that returns a new array with elements in reverse order.',
        testCases: [
            { args: [[1, 2, 3]], result: [3, 2, 1] },
            { args: [['a', 'b']], result: ['b', 'a'] },
            { args: [[42]], result: [42] },
            { args: [[]], result: [] },
            { args: [[1, 2, 3, 4, 5]], result: [5, 4, 3, 2, 1] }
        ]
    },
    {
        question: 'Write a function f(str1, str2) that concatenates two strings.',
        testCases: [
            { args: ['hello', 'world'], result: 'helloworld' },
            { args: ['', 'test'], result: 'test' },
            { args: ['test', ''], result: 'test' },
            { args: ['a', 'b'], result: 'ab' },
            { args: ['123', '456'], result: '123456' }
        ]
    },
    {
        question: 'Write a function f(n, exp) that returns n raised to the power of exp.',
        testCases: [
            { args: [2, 3], result: 8 },
            { args: [5, 0], result: 1 },
            { args: [3, 2], result: 9 },
            { args: [10, 1], result: 10 },
            { args: [2, 4], result: 16 }
        ]
    },
    {
        question: 'Write a function f(arr, value) that returns the index of the first occurrence of a value in an array.',
        testCases: [
            { args: [[1, 2, 3, 2], 2], result: 1 },
            { args: [['a', 'b', 'c'], 'c'], result: 2 },
            { args: [[1, 2, 3], 4], result: -1 },
            { args: [[], 1], result: -1 },
            { args: [[0, false], false], result: 1 }
        ]
    },
    {
        question: 'Write a function f(str) that checks if a string is empty or contains only whitespace.',
        testCases: [
            { args: [''], result: true },
            { args: ['   '], result: true },
            { args: ['hello'], result: false },
            { args: [' a '], result: false },
            { args: ['\t\n'], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the sum of all even numbers in an array.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: 6 },
            { args: [[1, 3, 5]], result: 0 },
            { args: [[2, 4, 6]], result: 12 },
            { args: [[]], result: 0 },
            { args: [[-2, -4, 1]], result: -6 }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the sum of all odd numbers in an array.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: 4 },
            { args: [[2, 4, 6]], result: 0 },
            { args: [[1, 3, 5]], result: 9 },
            { args: [[]], result: 0 },
            { args: [[-1, -3, 2]], result: -4 }
        ]
    },
    {
        question: 'Write a function f(n) that returns the number of digits in a positive integer.',
        testCases: [
            { args: [123], result: 3 },
            { args: [5], result: 1 },
            { args: [1000], result: 4 },
            { args: [0], result: 1 },
            { args: [99], result: 2 }
        ]
    },
    {
        question: 'Write a function f(arr) that returns true if all elements in an array are equal.',
        testCases: [
            { args: [[1, 1, 1]], result: true },
            { args: [[1, 2, 1]], result: false },
            { args: [['a', 'a']], result: true },
            { args: [[]], result: true },
            { args: [[5]], result: true }
        ]
    },
    {
        question: 'Write a function f(str) that returns a string with all duplicate characters removed.',
        testCases: [
            { args: ['hello'], result: 'helo' },
            { args: ['programming'], result: 'progamin' },
            { args: ['aaa'], result: 'a' },
            { args: [''], result: '' },
            { args: ['abcdef'], result: 'abcdef' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns true if an array is sorted in ascending order.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: true },
            { args: [[4, 3, 2, 1]], result: false },
            { args: [[1, 1, 2]], result: true },
            { args: [[]], result: true },
            { args: [[5]], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the minimum number in an array.',
        testCases: [
            { args: [[3, 1, 4, 1, 5]], result: 1 },
            { args: [[-1, -5, -2]], result: -5 },
            { args: [[42]], result: 42 },
            { args: [[0, 100, -50]], result: -50 },
            { args: [[10, 10, 10]], result: 10 }
        ]
    },
    {
        question: 'Write a function f(str) that returns true if a string contains at least one digit.',
        testCases: [
            { args: ['hello123'], result: true },
            { args: ['hello'], result: false },
            { args: ['123'], result: true },
            { args: [''], result: false },
            { args: ['test1test'], result: true }
        ]
    },
    {
        question: 'Write a function f(str) that returns true if a string contains at least one uppercase letter.',
        testCases: [
            { args: ['Hello'], result: true },
            { args: ['hello'], result: false },
            { args: ['HELLO'], result: true },
            { args: [''], result: false },
            { args: ['testA'], result: true }
        ]
    },
    {
        question: 'Write a function f(str) that returns true if a string contains at least one lowercase letter.',
        testCases: [
            { args: ['Hello'], result: true },
            { args: ['HELLO'], result: false },
            { args: ['hello'], result: true },
            { args: [''], result: false },
            { args: ['TESTa'], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns a new array containing only positive numbers.',
        testCases: [
            { args: [[-1, 2, -3, 4]], result: [2, 4] },
            { args: [[-5, -10]], result: [] },
            { args: [[1, 2, 3]], result: [1, 2, 3] },
            { args: [[0, -1, 1]], result: [1] },
            { args: [[]], result: [] }
        ]
    },
    {
        question: 'Write a function f(arr) that returns a new array containing only negative numbers.',
        testCases: [
            { args: [[-1, 2, -3, 4]], result: [-1, -3] },
            { args: [[1, 2, 3]], result: [] },
            { args: [[-5, -10]], result: [-5, -10] },
            { args: [[0, -1, 1]], result: [-1] },
            { args: [[]], result: [] }
        ]
    },
    {
        question: 'Write a function f(str, substring) that returns true if a string contains a substring.',
        testCases: [
            { args: ['hello world', 'world'], result: true },
            { args: ['programming', 'gram'], result: true },
            { args: ['test', 'xyz'], result: false },
            { args: ['', 'a'], result: false },
            { args: ['abc', ''], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the range (difference between max and min) of an array.',
        testCases: [
            { args: [[1, 5, 3]], result: 4 },
            { args: [[10, 10, 10]], result: 0 },
            { args: [[-5, 5]], result: 10 },
            { args: [[100]], result: 0 },
            { args: [[1, 2, 10, 4]], result: 9 }
        ]
    },
    {
        question: 'Write a function f(n) that returns the sum of all numbers from 1 to n.',
        testCases: [
            { args: [5], result: 15 },
            { args: [1], result: 1 },
            { args: [0], result: 0 },
            { args: [10], result: 55 },
            { args: [3], result: 6 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the middle character of a string (or middle two for even length).',
        testCases: [
            { args: ['hello'], result: 'l' },
            { args: ['test'], result: 'es' },
            { args: ['a'], result: 'a' },
            { args: ['ab'], result: 'ab' },
            { args: ['programming'], result: 'ra' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns true if an array contains duplicate values.',
        testCases: [
            { args: [[1, 2, 3, 2]], result: true },
            { args: [[1, 2, 3]], result: false },
            { args: [[]], result: false },
            { args: [['a', 'b', 'a']], result: true },
            { args: [[1]], result: false }
        ]
    },
    {
        question: 'Write a function f(str) that returns the string with leading and trailing whitespace removed.',
        testCases: [
            { args: ['  hello  '], result: 'hello' },
            { args: ['test'], result: 'test' },
            { args: ['   '], result: '' },
            { args: ['\thello\n'], result: 'hello' },
            { args: [''], result: '' }
        ]
    },
    {
        question: 'Write a function f(arr, value) that returns a new array with all occurrences of value removed.',
        testCases: [
            { args: [[1, 2, 3, 2], 2], result: [1, 3] },
            { args: [['a', 'b', 'a'], 'a'], result: ['b'] },
            { args: [[1, 2, 3], 4], result: [1, 2, 3] },
            { args: [[], 1], result: [] },
            { args: [[1, 1, 1], 1], result: [] }
        ]
    },
    {
        question: 'Write a function f(str) that returns true if a string is a valid email format (contains @ and .).',
        testCases: [
            { args: ['test@example.com'], result: true },
            { args: ['invalid-email'], result: false },
            { args: ['test@'], result: false },
            { args: ['@example.com'], result: false },
            { args: ['user@domain.co.uk'], result: true }
        ]
    },
    {
        question: 'Write a function f(n) that returns true if n is a power of 2.',
        testCases: [
            { args: [8], result: true },
            { args: [6], result: false },
            { args: [1], result: true },
            { args: [16], result: true },
            { args: [0], result: false }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the median value of an array of numbers.',
        testCases: [
            { args: [[1, 3, 5]], result: 3 },
            { args: [[1, 2, 3, 4]], result: 2.5 },
            { args: [[7]], result: 7 },
            { args: [[5, 1, 3]], result: 3 },
            { args: [[10, 20]], result: 15 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the string in alternating case (aLtErNaTiNg).',
        testCases: [
            { args: ['hello'], result: 'hElLo' },
            { args: ['test'], result: 'tEsT' },
            { args: ['a'], result: 'a' },
            { args: ['programming'], result: 'pRoGrAmMiNg' },
            { args: [''], result: '' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the most frequent element in an array.',
        testCases: [
            { args: [[1, 2, 3, 2, 2]], result: 2 },
            { args: [['a', 'b', 'a']], result: 'a' },
            { args: [[1, 1, 2, 2]], result: 1 },
            { args: [[5]], result: 5 },
            { args: [[1, 2, 3, 4]], result: 1 }
        ]
    },
    {
        question: 'Write a function f(n) that returns an array of numbers from 1 to n.',
        testCases: [
            { args: [5], result: [1, 2, 3, 4, 5] },
            { args: [1], result: [1] },
            { args: [0], result: [] },
            { args: [3], result: [1, 2, 3] },
            { args: [2], result: [1, 2] }
        ]
    },
    {
        question: 'Write a function f(str) that returns the number of consonants in a string.',
        testCases: [
            { args: ['hello'], result: 3 },
            { args: ['aeiou'], result: 0 },
            { args: ['programming'], result: 7 },
            { args: [''], result: 0 },
            { args: ['xyz'], result: 3 }
        ]
    },
    {
        question: 'Write a function f(arr1, arr2) that returns the union of two arrays (all unique elements).',
        testCases: [
            { args: [[1, 2], [2, 3]], result: [1, 2, 3] },
            { args: [['a'], ['b']], result: ['a', 'b'] },
            { args: [[], [1, 2]], result: [1, 2] },
            { args: [[1, 1], [1, 1]], result: [1] },
            { args: [[1, 2, 3], [4, 5, 6]], result: [1, 2, 3, 4, 5, 6] }
        ]
    },
    {
        question: 'Write a function f(str) that returns true if parentheses in a string are balanced.',
        testCases: [
            { args: ['()'], result: true },
            { args: ['(())'], result: true },
            { args: ['(('], result: false },
            { args: ['())'], result: false },
            { args: [''], result: true }
        ]
    },
    {
        question: 'Write a function f(n) that returns the nth triangular number (1+2+...+n).',
        testCases: [
            { args: [4], result: 10 },
            { args: [1], result: 1 },
            { args: [5], result: 15 },
            { args: [0], result: 0 },
            { args: [6], result: 21 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the string with words in reverse order.',
        testCases: [
            { args: ['hello world'], result: 'world hello' },
            { args: ['the quick brown fox'], result: 'fox brown quick the' },
            { args: ['single'], result: 'single' },
            { args: [''], result: '' },
            { args: ['a b c'], result: 'c b a' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the difference between the largest and smallest elements.',
        testCases: [
            { args: [[1, 5, 3, 9, 2]], result: 8 },
            { args: [[10]], result: 0 },
            { args: [[-5, -1, -10]], result: 9 },
            { args: [[0, 0, 0]], result: 0 },
            { args: [[100, 1, 50]], result: 99 }
        ]
    },
    {
        question: 'Write a function f(str, n) that repeats a string n times.',
        testCases: [
            { args: ['hello', 3], result: 'hellohellohello' },
            { args: ['a', 5], result: 'aaaaa' },
            { args: ['test', 0], result: '' },
            { args: ['', 3], result: '' },
            { args: ['hi', 1], result: 'hi' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns every second element of an array.',
        testCases: [
            { args: [[1, 2, 3, 4, 5]], result: [2, 4] },
            { args: [['a', 'b', 'c']], result: ['b'] },
            { args: [[1, 2]], result: [2] },
            { args: [[1]], result: [] },
            { args: [[]], result: [] }
        ]
    },
    {
        question: 'Write a function f(n) that returns true if n is a palindrome number.',
        testCases: [
            { args: [121], result: true },
            { args: [123], result: false },
            { args: [1], result: true },
            { args: [1221], result: true },
            { args: [12321], result: true }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the sum of indices where the value equals the index.',
        testCases: [
            { args: [[0, 1, 4, 3]], result: 4 },
            { args: [[1, 1, 2, 3]], result: 1 },
            { args: [[0, 0, 2]], result: 2 },
            { args: [[5, 6, 7]], result: 0 },
            { args: [[]], result: 0 }
        ]
    },
    {
        question: 'Write a function f(str) that returns the longest sequence of consecutive identical characters.',
        testCases: [
            { args: ['aaabbc'], result: 3 },
            { args: ['abcdef'], result: 1 },
            { args: ['aabbbbcc'], result: 4 },
            { args: [''], result: 0 },
            { args: ['aaaa'], result: 4 }
        ]
    },
    {
        question: 'Write a function f(n) that converts a number to its binary representation as a string.',
        testCases: [
            { args: [5], result: '101' },
            { args: [8], result: '1000' },
            { args: [0], result: '0' },
            { args: [1], result: '1' },
            { args: [15], result: '1111' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns true if the array forms an arithmetic sequence (the distance between each number is constant).',
        testCases: [
            { args: [[1, 3, 5, 7]], result: true },
            { args: [[2, 4, 6, 8]], result: true },
            { args: [[1, 2, 4, 8]], result: false },
            { args: [[5, 5, 5]], result: true },
            { args: [[1, 2]], result: true }
        ]
    },
    {
        question: 'Write a function f(str) that returns the character that appears most times consecutively.',
        testCases: [
            { args: ['aaabbc'], result: 'a' },
            { args: ['hello'], result: 'l' },
            { args: ['aabbbbcc'], result: 'b' },
            { args: ['abcdef'], result: 'a' },
            { args: [''], result: '' }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the array rotated one position to the right.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: [4, 1, 2, 3] },
            { args: [['a', 'b']], result: ['b', 'a'] },
            { args: [[1]], result: [1] },
            { args: [[]], result: [] },
            { args: [[1, 2, 3, 4, 5]], result: [5, 1, 2, 3, 4] }
        ]
    },
    {
        question: 'Write a function f(arr) that returns the array rotated one position to the left.',
        testCases: [
            { args: [[1, 2, 3, 4]], result: [2, 3, 4, 1] },
            { args: [['a', 'b']], result: ['b', 'a'] },
            { args: [[1]], result: [1] },
            { args: [[]], result: [] },
            { args: [[1, 2, 3, 4, 5]], result: [2, 3, 4, 5, 1] }
        ]
    },
    {
        question: 'Write a function f(str) that returns true if the string has equal numbers of opening and closing brackets [].',
        testCases: [
            { args: ['[hello]'], result: true },
            { args: ['[test[nested]'], result: false },
            { args: ['no brackets'], result: true },
            { args: ['[[]]'], result: true },
            { args: [']['], result: false }
        ]
    },
    {
        question: 'Write a function f(arr, k) that returns the kth largest element (k=2 for second largest).',
        testCases: [
            { args: [[3, 1, 4, 1, 5], 2], result: 4 },
            { args: [[1, 2, 3], 1], result: 3 },
            { args: [[5, 5, 5], 2], result: 5 },
            { args: [[10, 20, 30], 3], result: 10 },
            { args: [[7, 7, 8, 9], 2], result: 8 }
        ]
    }
]
