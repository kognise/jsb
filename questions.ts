interface TestCase {
    args: unknown[]
    result: unknown
}

interface Question {
    question: string
    testCases: TestCase[]
}

export const questions: Question[] = []
