
import { useEffect, useReducer } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Loading from './components/Loading'
import Error from './components/Loading'
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinsihedScreen from './components/FinsihedScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

const SEC_PER_QUESTIONS=30;

const initailState= {
  questions:[],
  //ready , error , active , finished 
  status:"loading",
  index:0,
  answer:null,
  points:0,
  highscore:0,
  secondRemaining:null,
}
function reducer(state,action){
   switch(action.type){
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status:"Ready",
        secondRemaining:state.questions.length * SEC_PER_QUESTIONS,
      }
    case 'dataFailed':
      return {
        ...state,
        state:"error"
      }
    case 'start':
      return {...state,status : 'active'}
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return {
        ...state,
        index:state.index + 1,
        answer:null,
      }
    case 'finish':
      return {
        ...state,
        status:'finished',
        highscore:state.points > state.highscore ? state.points : state.highscore,
      }
    case "restart":
      return {
        ...initailState,
        questions:state.questions,
        status:'Ready',
      }
    case 'tick':
      return {
        ...state,
        secondRemaining:state.secondRemaining -1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      }
    default:
     throw new Error('Action Unknown')
   } 
}

function App() {

 const [{questions,status,index,answer,points,highscore,secondRemaining},dispatch]=useReducer(reducer,initailState);
 const numQuestions=questions.length;
 const maxQuestionPoints=questions.reduce((prev,cur)=>prev + cur.points,0)
 useEffect(function(){
  fetch('http://localhost:9000/questions')
  .then((res)=>res.json())
  .then((data)=>dispatch({type:'dataReceived',payload: data}))
  .catch(err=>dispatch({type:'failedData'}))

 },[])

  return (
    <div className='app'>
        <Header/>
        <Main>
          {status === 'loading' && <Loading/>}
          {status === 'error' && <Error/>}
          {status === 'Ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
          {status === 'active' &&
            <>
            <Progress numQuestions={numQuestions}  index={index} points={points} maxQuestionPoints={maxQuestionPoints} answer={answer}/>
           <Question questions={questions[index]} answer={answer} dispatch={dispatch}/>
           <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining}/>
              <NextButton dispatch={dispatch} answer={answer}
              index={index} numQuestions={numQuestions}/>
            </Footer>
          </>
          }
          {status === 'finished' && <FinsihedScreen maxQuestionPoints={maxQuestionPoints} points={points} highscore={highscore} dispatch={dispatch}/>}
        </Main>
    </div>
  );
}

export default App;
