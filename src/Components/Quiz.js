import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card } from 'reactstrap';
import App from '../App';
import Result from './Result'
import userQuizContext from '../Context/userQuizContext';
import './Quiz.css';

export default function Quiz() {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizData, setQuizData] = useState({});
    const [currentOptions, setCurrentOptions] = useState([]);
    const [scores, setScores] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1])
    // const scores = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    const context = useContext(userQuizContext);
    const amount = 10;
    const category = context.user.triviaCategory;
    const difficulty = context.user.difficulty;

    const navigate = useNavigate()

    useEffect(() => { shuffleOptions() }, [quizData])

    useEffect(() => { fetchData() }, [])

    useEffect(() => { shuffleOptions() }, [currentQuestion])

    async function fetchData() {
        // You can await here
        // setCurrentQuestion(1)    
        await fetchQuiz().then((data) => {
            setQuizData(data)

        })
    }
    // fetchQuiz()
    async function fetchQuiz() {
        console.log('Category = ', category, ' Diff = ', difficulty);
        const urlString = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        try {

            const { data } = await axios.get(urlString)
            // console.log('data in fetchQuiz() = ', data);
            for (let i = 0; i < 10; i++) {
                let result = data?.results[i];
                result.question = decodeString(result?.question)
                result.correct_answer = decodeString(result.correct_answer)
                result.incorrect_answers[0] = decodeString(result.incorrect_answers[0])
                result.incorrect_answers[1] = decodeString(result.incorrect_answers[1])
                result.incorrect_answers[2] = decodeString(result.incorrect_answers[2])
            }
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    function shuffleOptions() {
        if (Object.keys(quizData).length === 0
            && quizData.constructor === Object)
            return;

        let array = [];
        array.push(quizData.results[currentQuestion]?.correct_answer);
        array.push(quizData.results[currentQuestion]?.incorrect_answers?.at(0));
        array.push(quizData.results[currentQuestion]?.incorrect_answers?.at(1));
        array.push(quizData.results[currentQuestion]?.incorrect_answers?.at(2));

        let keys = 1;
        let shuffle = []
        let random = (Math.random() * 3).toFixed();
        while (array.length > 0) {
            if (array[random] !== undefined) {

                shuffle.push(
                    {
                        text: decodeString(array[random]),
                        key: keys++,
                        style: ''
                    }
                )
                array.splice(random, 1);
            }
            random = (Math.random() * (array.length - 1)).toFixed();
        }
        setCurrentOptions(shuffle)

    }

    const decodeString = (string) => {
        const parser = new DOMParser();
        return parser.parseFromString(`<!doctype html><body>${string}`, 'text/html').body.textContent;
    }

    async function evaluateAnswer(e) {
        console.log('currentQuestion = ', currentQuestion);
        console.log('scores = ', scores);
        const ans = e.target.textContent;

        if (scores[currentQuestion] !== -1)
            return toast.info('Already Answered')

        if (ans === quizData?.results[currentQuestion]?.correct_answer) {
            let s = [...scores]
            s[currentQuestion] = 1
            setScores(s)
            // toast.success('Correct Answer', {
            //     position: "top-right",
            //     autoClose: 1000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            // })
            let cop = [...currentOptions];
            let i = 0;
            while (cop[i].text !== ans) { i++; }
            cop[i].style = 'correct_answer'

            setCurrentOptions(cop);
        }
        else {
            let s = [...scores]
            s[currentQuestion] = 0
            setScores(s)
            // toast.error('Wrong Answer', {
            //     position: "top-right",
            //     autoClose: 1000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            // })
            let cop = [...currentOptions];
            let i = 0;
            while (cop[i].text !== ans) { i++; }
            cop[i].style = 'incorrect_answer'

            i = 0;
            while (cop[i].text !== quizData?.results[currentQuestion]?.correct_answer) { i++; }
            cop[i].style = 'correct_answer'

            setCurrentOptions(cop);
        }
    }

    const nextQuestion = () => {
        if (scores[currentQuestion] === -1)
            return toast.warn('Not Answered', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        else if (currentQuestion === 9) {
            let score = 0;
            scores.map(item => score += item)
            context.user.score = score
        console.log(context.user)
        navigate('/result')
        }
        else {
            setCurrentQuestion(currentQuestion + 1)
        }
    }


    return (
        <main>

            {/* <Button onClick={() => fetchData()}>Start</Button> */}
            {
                quizData.response_code === 0 ? (
                    <>
                        <h2> {decodeString(quizData?.results[currentQuestion]?.question)} </h2>
                        {console.table(currentOptions)}
                        {

                            <>
                                <Card key={currentOptions[0]?.key}
                                    className={`p-2 m-2 mycard ${currentOptions[0]?.style}`}
                                    onClick={(e) => evaluateAnswer(e)}
                                >{currentOptions[0]?.text}</Card>

                                <Card key={currentOptions[1]?.key}
                                    className={`p-2 m-2 mycard ${currentOptions[1]?.style}`}
                                    onClick={(e) => evaluateAnswer(e)}
                                >{currentOptions[1]?.text}</Card>

                                <Card key={currentOptions[2]?.key}
                                    className={`p-2 m-2 mycard ${currentOptions[2]?.style}`}
                                    onClick={(e) => evaluateAnswer(e)}
                                >{currentOptions[2]?.text}</Card>

                                <Card key={currentOptions[3]?.key}
                                    className={`p-2 m-2 mycard ${currentOptions[3]?.style}`}
                                    onClick={(e) => evaluateAnswer(e)}
                                >{currentOptions[3]?.text}</Card>
                            </>
                        }
                        <Button onClick={() => nextQuestion()}>Next</Button>



                    </>
                ) : (
                    <h2></h2>
                )
            }
        </main>
    )
}

export const Quizzy = () => {
    const context = useContext(userQuizContext);
    const navigate = useNavigate()

    if (context.user !== null) {
        return (
            <Quiz />
        )
    }
    else
        return (
            <App />)
}
