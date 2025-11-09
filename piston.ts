export async function execute(language: string, code: string): Promise<any> {
    const res = await fetch('http://how-did-i-get-here.net:2000/api/v2/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            language,
            version: language === 'python' ? '3.12.0' : '20.11.1',
            files: [ { content: code } ],
        })
    })
    return await res.json()
}
