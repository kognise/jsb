export interface TestCase {
    args: unknown[]
    result: unknown
}

export interface Question {
    question: string
    testCases: TestCase[]
}

export const questions: Question[] = []
