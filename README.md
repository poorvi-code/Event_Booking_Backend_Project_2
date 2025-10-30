🟢 Synergia Event Booking API (MongoDB)

A RESTful Node.js + Express API for managing events and bookings, now connected to MongoDB using the official MongoDB client.

This project allows you to:

Create, read, update, and delete events and bookings.

Search bookings by email.

Filter bookings by event name.

Store all data in MongoDB (no in-memory arrays).

⚙️ Tech Stack

Node.js + Express

MongoDB Atlas / Compass

MongoDB Node.js Driver

dotenv for environment variables

express-validator for request validation

📁 Project Structure
Synergia_Booking_Event/
│
├── events.js                # Main API server file
├── package.json             # Project dependencies
├── .env                     # MongoDB URI (not uploaded to GitHub)
├── README.md                # Setup and usage guide
└── Synergia-Event-Booking-API.postman_collection.json  # Postman test collection

🔧 Setup Instructions
1️⃣ Clone the Repository
git clone <your-repo-url>
cd Synergia_Booking_Event

2️⃣ Install Dependencies
npm install mongodb
npm install express


This installs:

mongodb

express

express-validator

dotenv

3️⃣ Configure .env

Create a .env file in the root folder (if not present):

PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority


⚠️ Replace <username> and <password> with your actual MongoDB credentials.
Do not commit .env to GitHub.

4️⃣ Run the Server
node events.js


Expected terminal output:

 Connected to MongoDB and initialized collections.
 Synergia Event Booking API running at http://localhost:3000

🧪 Testing the API with Postman
Step 1 — Import Collection

Open Postman

Go to File → Import

Upload: Synergia-Event-Booking-API.postman_collection.json

Open the collection from the sidebar.

Step 2 — Test Endpoints (in order)
#	HTTP Method	Endpoint	Description
1	GET	/api/events	Get all events

2	POST	/api/events	Create a new event

3	PUT	/api/events/:id	Update event details

4	DELETE	/api/events/:id	Delete an event

5	GET	/api/bookings	Get all bookings

6	POST	/api/bookings	Create a new booking

7	GET	/api/bookings/:id	Get booking by ID

8	PUT	/api/bookings/:id	Update booking details

9	DELETE	/api/bookings/:id	Delete a booking

10	GET	/api/bookings/search?email=example@gmail.com	Search bookings by email
<img width="1920" height="1080" alt="Screenshot 2025-10-30 223846" src="https://github.com/user-attachments/assets/ad99c5ed-07e2-4a79-bd48-2cfe690d7baf" />
<img width="1920" height="1080" alt="Screenshot 2025-10-30 223554" src="https://github.com/user-attachments/assets/49018d91-ac4d-40ac-933d-9ea665bef139" />

11	GET	/api/bookings/filter?event=Synergia	Filter bookings by event name
