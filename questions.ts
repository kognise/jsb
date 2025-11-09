interface TestCase {
    args: unknown[]
    result: unknown
}

interface Question {
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
    }
]
