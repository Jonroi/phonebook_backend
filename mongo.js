require('dotenv').config();

const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please enter a password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });

      person
        .save()
        .then(() => console.log(
          `Added ${process.argv[3]} number ${process.argv[4]} to phonebook`,
        ))
        .catch((error) => console.error('Person not saved:', error))
        .finally(() => mongoose.connection.close());
    } else {
      Person.find({})
        .then((people) => {
          console.log('Phonebook:');
          people.forEach((person) => console.log(person.name, person.number));
        })
        .catch((error) => console.error('Finding people collection failed:', error))
        .finally(() => mongoose.connection.close());
    }
  })
  .catch((error) => console.error('Database connection error:', error));
