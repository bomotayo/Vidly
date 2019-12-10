const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

const genres = [
  {id: 1, movieType: 'action'},
  {id: 2, movieType: 'horror'},
  {id: 3, movieType: 'comedy'},
]

//Getting all movies
app.get('/api/genres', (req,res) => {
  res.send(genres)
});

//Getting movie genre with id
app.get('/api/genres/:id', (req,res) => {
  //check if id is valid and returns 404 if it does not exist
  const genre = genres.find( g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('Movie genre not found');
  res.send(genre);
});

//Posting new movie
app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    movieType: req.body.movieType
  };
  genres.push(genre);
  res.send(genre);
});


//Put/Updating movie in genres object
app.put('/api/genres/:id', (req,res) => {
  //Look up ID & return 404 if it does not exist
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('Movie genre not found');

  //Validate cont & return 400 if content is invalid
  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //update cont & return updated content
  genre.movieType = req.body.movieType;
  res.send(genre);
});


//Deleting movie genre with id
app.delete('/api/genres/:id', (req,res) => {
  //check if id is valid and returns 404 if it does not exist
  const genre = genres.find( g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('Movie genre not found');

  //if id is valid. Finds the index, deletes and returns the genre
  const index = genres.indexOf(genre);
  genres.splice(index,1);
  res.send(genre);
});

//Validation with Joi
function validateGenre(genre){
  const schema = {
    movieType: Joi.string().min(3).required()
  };
  
  return  Joi.validate(genre, schema); 
}

const port = process.env.PORT || 3030;
app.listen(port , () => console.log(`listening on ${port}`));
