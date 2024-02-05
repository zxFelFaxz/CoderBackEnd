export class CreateUserDto {
    constructor(userInfo) {
        this.full_name = !userInfo.github_user ? `${userInfo.first_name} ${userInfo.last_name}` : userInfo.github_name
        this.role = userInfo.role
        this.cart = userInfo.cart
        this.github_user = userInfo.github_user

        if (!userInfo.github_user) {
            this.first_name = userInfo.first_name
            this.last_name = userInfo.last_name
            this.email = userInfo.email
            this.age = userInfo.age
            this.password = userInfo.password

            // To avoid errors with the unique of github_username
            this.github_username = `Registered with email address: ${userInfo.email}`
        } 

        if (userInfo.github_user) {
            this.github_username = userInfo.github_username

            // To avoid mistakes with the unique email
            this.email = `Registered with GitHub: ${userInfo.github_username}`
        }
    }
}