# Crowdfundr

Crowdfundr is a platform designed to streamline crowdfunding campaigns, empowering users to create projects and gather support for their initiatives. This repository contains the source code and documentation for the Crowdfundr application.

## Features

- **User Authentication:** Secure registration and login system for users.
- **Project Creation:** Users can effortlessly create new crowdfunding projects, defining goals and project details.
- **Fundraising Capabilities:** Ability for users to contribute funds to projects they wish to support.
- **Project Management:** Project creators can efficiently manage their initiatives, update progress, and engage with supporters.
- **Search and Filter:** Users can explore projects, applying filters based on categories, popularity, and more.

## Installation

To run the Crowdfundr application locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/adarshdoesntcode/crowdfundr.git
    ```

2. Navigate to the project directory:

    ```bash
    cd crowdfundr
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and add the necessary environment variables following the `.env.example` file.

5. Start the application:

    ```bash
    npm start
    ```

6. Access Crowdfundr:

    Open your web browser and visit `http://localhost:3000` to access the Crowdfundr application.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Backend web framework.
- **React**: Frontend library for building user interfaces.
- **MongoDB**: Database system for storing application data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: JSON Web Token for authentication.

## Contribution

Contributions are welcome! To contribute to Crowdfundr, follow these steps:

1. Fork the repository.
2. Create your branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Submit a pull request.

Please ensure your pull request adheres to the project's code style.

## License

This project is licensed under the [MIT License](LICENSE).
