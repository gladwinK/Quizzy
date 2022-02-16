import { useState, useContext } from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom'
import userQuizContext from './Context/userQuizContext';

import './App.css';

function App() {
  let [triviaCategory, setTriviaCategory] = useState(9);
  let [difficulty, setDifficulty] = useState('easy')
  let navigate = useNavigate()

  let context = useContext(userQuizContext);

  const setCat = (c) => {
    if (c === 'any') {
      let cat = (Math.random() * 24 + 9).toFixed();
      setTriviaCategory(parseInt(cat))
    }
    else setTriviaCategory(parseInt(c));
    console.log(triviaCategory);
  }

  let startQuiz = () => {
    context.setUser(
      {
        triviaCategory: triviaCategory,
        difficulty: difficulty
      }
    )
    navigate('/quiz');
  }

  return (
    <div className="App">
      <h2>Select Category </h2>
      <select name="trivia_category" className="" onChange={(e) => {
        setCat(e.target.value)
        // console.log(e.target.value);
      }}>
        <option value="any">Any Category</option>
        <option value="9">General Knowledge</option>
        <option value="10">Entertainment: Books</option>
        <option value="11">Entertainment: Film</option>
        <option value="12">Entertainment: Music</option>
        <option value="13">Entertainment: Musicals &amp; Theatres</option>
        <option value="14">Entertainment: Television</option>
        <option value="15">Entertainment: Video Games</option>
        <option value="16">Entertainment: Board Games</option>
        <option value="17">Science &amp; Nature</option>
        <option value="18">Science: Computers</option>
        <option value="19">Science: Mathematics</option>
        <option value="20">Mythology</option>
        <option value="21">Sports</option>
        <option value="22">Geography</option>
        <option value="23">History</option>
        <option value="24">Politics</option>
        <option value="25">Art</option>
        <option value="26">Celebrities</option>
        <option value="27">Animals</option>
        <option value="28">Vehicles</option>
        <option value="29">Entertainment: Comics</option>
        <option value="30">Science: Gadgets</option>
        <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
        <option value="32">Entertainment: Cartoon &amp; Animations</option>
      </select>

      <h2>Difficulty</h2>
      <select name=' difficulty' onChange={(e) => setDifficulty(e.target.value)}>
        <option value='easy'>Easy</option>
        <option value='medium'>Medium</option>
        <option value='hard'>Hard</option>
      </select>
      <br></br>
      {/* <Link to='/quiz'>
      </Link> */}
      <Button color='danger' className='p-1 m-1' onClick={() => startQuiz()}>Start Quiz</Button>

    </div>
  );
}

export default App;
