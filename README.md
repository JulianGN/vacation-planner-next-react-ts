# Vacation Planner App

This application calculates the best possibilities of vacation days by identifying holiday combinations that allow for maximizing time off (e.g., bridging holidays with weekends).

## Features

Holiday Calculations: Calculates national, state, and city holidays, including custom algorithms for Easter, Carnival, and Corpus Christi.
Bridge Day Identification: Finds holidays that fall near weekends, allowing for potential "bridge" vacations.
Custom Period Search: Users can search for holidays within specific date ranges.

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/vacation-planner.git
```

2. Navigate to the project directory:

```bash
cd vacation-planner
```

3. Install dependencies:

```bash
npm install
```

4. Create an .env file and set the required environment variables:

```bash
MONGO_URI=<your-mongo-uri>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Start the server:

```bash
npm start
```

## Usage

### Running Locally

To run the application locally, ensure that your MongoDB server is running and your .env is properly configured. Then, start the development server using:

```bash
npm run dev
```

## Technologies Used

**Node.js:** Backend runtime environment.

**Next:** Web framework for API development.

**MongoDB:** NoSQL database for holiday data storage.

**TypeScript:** Strict typing and better developer tooling.

**Netlify:** Deployment platform for frontend/backend applications.

## License

This project is licensed under the MIT License.
