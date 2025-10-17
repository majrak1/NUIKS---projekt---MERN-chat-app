# NOTES


## JWT token creation
- open bash terminal
- run this command: openssl rand -base64 32
- result is in the .env file

reasons: security. in postman, you can send a POST to create a new user and then check the response. under cookies, you'll see if it's on http/https, creation, expiration...