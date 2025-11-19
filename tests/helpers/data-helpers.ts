export function generateRandomUser() {
    return {
        username: `user${Math.floor(Math.random() * 1000)}`,
        password: 'password'
    };
}