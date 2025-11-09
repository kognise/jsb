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
        question: 'Write a function func(a, b) that returns the sum of two numbers.',
        testCases: [
            { args: [2, 3], result: 5 },
            { args: [0, 0], result: 0 },
            { args: [-1, 1], result: 0 },
            { args: [100, -50], result: 50 },
            { args: [0.5, 0.3], result: 0.8 }
        ]
    },
    {
        question: 'Write a function func(str) that reverses a string.',
        testCases: [
            { args: ['hello'], result: 'olleh' },
            { args: [''], result: '' },
            { args: ['a'], result: 'a' },
            { args: ['racecar'], result: 'racecar' },
            { args: ['12345'], result: '54321' }
        ]
    },
    {
        question: 'Write a function func(str) that checks if a string is a palindrome (reads the same forwards and backwards).',
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
        question: 'Write a function func(n) that calculates the factorial of a number (n! = n * (n-1) * ... * 1).',
        testCases: [
            { args: [5], result: 120 },
            { args: [0], result: 1 },
            { args: [1], result: 1 },
            { args: [3], result: 6 },
            { args: [7], result: 5040 }
        ]
    },
    {
        question: 'Write a function func(n) that returns the nth Fibonacci number (0, 1, 1, 2, 3, 5, 8, ...).',
        testCases: [
            { args: [0], result: 0 },
            { args: [1], result: 1 },
            { args: [2], result: 1 },
            { args: [6], result: 8 },
            { args: [10], result: 55 }
        ]
    },
    {
        question: 'Write a function func(arr) that finds the maximum number in an array.',
        testCases: [
            { args: [[1, 3, 2]], result: 3 },
            { args: [[-1, -3, -2]], result: -1 },
            { args: [[42]], result: 42 },
            { args: [[1, 100, 2, 50]], result: 100 },
            { args: [[0, 0, 0]], result: 0 }
        ]
    },
    {
        question: 'Write a function func(n) that checks if a number is prime (only divisible by 1 and itself).',
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
        question: 'Write a function func(str) that counts the number of vowels (a, e, i, o, u) in a string.',
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
        question: 'Write a function func(arr) that removes duplicate values from an array.',
        testCases: [
            { args: [[1, 2, 2, 3]], result: [1, 2, 3] },
            { args: [[]], result: [] },
            { args: [[1, 1, 1]], result: [1] },
            { args: [[1, 2, 3]], result: [1, 2, 3] },
            { args: [['a', 'b', 'a', 'c']], result: ['a', 'b', 'c'] }
        ]
    },
    {
        question: 'Write a function func(str) that capitalizes the first letter of each word in a string.',
        testCases: [
            { args: ['hello world'], result: 'Hello World' },
            { args: [''], result: '' },
            { args: ['a'], result: 'A' },
            { args: ['the quick brown fox'], result: 'The Quick Brown Fox' },
            { args: ['already Capitalized'], result: 'Already Capitalized' }
        ]
    },
    {
        question: 'Write a function func(arr) that sorts an array of numbers in ascending order.',
        testCases: [
            { args: [[3, 1, 4, 1, 5]], result: [1, 1, 3, 4, 5] },
            { args: [[]], result: [] },
            { args: [[42]], result: [42] },
            { args: [[-1, -3, 0, 2]], result: [-3, -1, 0, 2] },
            { args: [[5, 5, 5]], result: [5, 5, 5] }
        ]
    },
    {
        question: 'Write a function func(str) that checks if a string contains only digits.',
        testCases: [
            { args: ['123'], result: true },
            { args: ['abc'], result: false },
            { args: [''], result: false },
            { args: ['123abc'], result: false },
            { args: ['0'], result: true }
        ]
    },
    {
        question: 'Write a function func(arr) that returns the second largest number in an array.',
        testCases: [
            { args: [[1, 3, 2, 5, 4]], result: 4 },
            { args: [[10, 10, 9]], result: 9 },
            { args: [[1, 1]], result: 1 },
            { args: [[5]], result: 5 },
            { args: [[-1, -5, -3]], result: -3 }
        ]
    },
    {
        question: 'Write a function func(str) that returns the most frequent character in a string.',
        testCases: [
            { args: ['hello'], result: 'l' },
            { args: ['abcabc'], result: 'a' },
            { args: ['a'], result: 'a' },
            { args: ['programming'], result: 'r' },
            { args: ['aabbcc'], result: 'a' }
        ]
    },
    {
        question: 'Write a function func(arr) that flattens a nested array one level deep.',
        testCases: [
            { args: [[[1, 2], [3, 4]]], result: [1, 2, 3, 4] },
            { args: [[[1], [2, 3], [4, 5, 6]]], result: [1, 2, 3, 4, 5, 6] },
            { args: [[[]]], result: [] },
            { args: [[[1, [2, 3]], [4]]], result: [1, [2, 3], 4] },
            { args: [[[1, 2, 3]]], result: [1, 2, 3] }
        ]
    },
    {
        question: 'Write a function func(n) that returns true if n is a perfect square.',
        testCases: [
            { args: [16], result: true },
            { args: [15], result: false },
            { args: [0], result: true },
            { args: [1], result: true },
            { args: [100], result: true }
        ]
    },
    {
        question: 'Write a function func(str) that returns the longest word in a sentence.',
        testCases: [
            { args: ['The quick brown fox'], result: 'quick' },
            { args: ['Hello world'], result: 'Hello' },
            { args: ['a'], result: 'a' },
            { args: ['Programming is fun'], result: 'Programming' },
            { args: [''], result: '' }
        ]
    },
    {
        question: 'Write a function func(arr1, arr2) that returns the intersection of two arrays.',
        testCases: [
            { args: [[1, 2, 3], [2, 3, 4]], result: [2, 3] },
            { args: [['a', 'b'], ['b', 'c']], result: ['b'] },
            { args: [[1, 2], [3, 4]], result: [] },
            { args: [[], [1, 2]], result: [] },
            { args: [[1, 1, 2], [1, 2, 2]], result: [1, 2] }
        ]
    }
]
