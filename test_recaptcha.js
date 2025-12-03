async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test',
                email: 'test@example.com',
                subject: 'Test',
                message: 'Test message',
                recaptchaToken: 'dummy_token'
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (e) {
        console.error(e);
    }
}
test();
