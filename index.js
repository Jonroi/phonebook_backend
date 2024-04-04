const express = require("express"); //express is a web application framework for Node.js
const morgan = require("morgan"); // morgan is a middleware that logs HTTP requests
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// custom token that returns request body
morgan.token("data", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

// Root content
app.get("/", (request, response) => {
  response.send(
    "<h1>Hello Persons Backend!</h1> <br> <p>to access json : http://localhost:3001/api/persons </p>"
  );
});

// Get all persons and their content
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Calculate amount of persons and sets date for searching
app.get("/api/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p> <br> <p>${new Date()}</p>`
  );
});

// Add new person
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    // Checks if name or number is missing
    return response.status(400).json({
      // Returns 400 if name is missing
      error: "name or number is missing",
    });
  }
  if (
    persons.find((person) => person.name === body.name) || // Checks if name already exists
    persons.find((person) => person.number === body.number) // Checks if number already exists
  ) {
    return response.status(400).json({
      error: "name and number must be unique",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

// Delete person by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id); // Extracts ID from URL and converts to number
  persons = persons.filter((person) => person.id !== id); // Filters out person by ID
  response.status(204).end(); // Returns 204 for success
});

// Handles retrieving person's info by 'id'. Returns JSON if found, else 404.
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Error handling for unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
// Starts server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
