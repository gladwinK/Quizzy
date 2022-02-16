import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Routes, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card } from 'reactstrap';
import userQuizContext from '../Context/userQuizContext';
import App from '../App'
import { toast } from 'react-toastify';
import './Quiz.css'

export default function Quiz() {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizData, setQuizData] = useState({});
    const [currentOptions, setCurrentOptions] = useState([]);
    const scores = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    const context = useContext(userQuizContext);
    const amount = 10;
    const category = context.user.triviaCategory;
    const difficulty = context.user.difficulty;
    const navigate = useNavigate()

    async function fetchData() {
        // You can await here
        // setCurrentQuestion(1)    
        await fetchQuiz().then((data) => {
            setQuizData(data)

        })
    }
    useEffect(() => {
        shuffleOptions()
    }, [quizData])
    
    useEffect( ()=>{fetchData()}, [])

useEffect( ()=>{shuffleOptions()}, [currentQuestion])
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
            console.log(error);
        }
    }

    function shuffleOptions() {
        if (Object.keys(quizData).length === 0
            && quizData.constructor === Object)
            return;

        // let results = quizData.results[0]
        // console.log(results);
        let array = [];
        array.push(quizData.results[currentQuestion]?.correct_answer);
        array.push(quizData.results[currentQuestion]?.incorrect_answers?.at(0));
        array.push(quizData.results[currentQuestion]?.incorrect_answers?.at(1));
        array.push(quizData.results[currentQuestion]?.incorrect_answers?.at(2));

        // console.log('array = ', array);
        let shuffle = []
        let random = (Math.random() * 3).toFixed();
        while (array.length > 0) {
            if (array[random] !== undefined) {

                shuffle.push(decodeString(array[random]));
                array.splice(random, 1);
            }
            random = (Math.random() * (array.length - 1)).toFixed();
        }
        setCurrentOptions(shuffle)
        console.log('Current Options = ', shuffle)

    }

    const decodeString = (string) => {
        const parser = new DOMParser();
        return parser.parseFromString(`<!doctype html><body>${string}`, 'text/html').body.textContent;
    }

    const evaluateAnswer = (ans) => {

    
        if (scores[currentQuestion] !== -1)
            return toast.info('Already Answered')

        if (ans === quizData?.results[currentQuestion]?.correct_answer) {
            scores[currentQuestion] = 1   
            toast.success('Correct Answer')
        }
        else{
            scores[currentQuestion] = 0 
            toast.error('Wrong Answer !')
        }
    }
    const nextQuestion = ()=>{
        if (scores[currentQuestion] === -1)
        return toast.warn('Not Answered', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        else{
            setCurrentQuestion(currentQuestion+1)
        }
    }
    return (
        <main>



            
            {/* <Button onClick={() => fetchData()}>Start</Button> */}
            {
                quizData.response_code === 0 ? (
                    <>
                        <h2> {decodeString(quizData?.results[currentQuestion]?.question)} </h2>
                        {
                            currentOptions.map((item, index) => (
                                <Card key={index} 
                                className='p-2 m-2 mycard' 
                                onClick={(e) => evaluateAnswer(e.target.textContent)}
                                style={{cursor:'pointer'}}
                                >{item}</Card>
                            ))
                        }
                        <Button onClick={ ()=> nextQuestion()}>Next</Button>
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
