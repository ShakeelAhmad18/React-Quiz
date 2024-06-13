
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

const initailState= {
  questions:[],
  //ready , error , active , finished 
  status:"loading",
  index:0,
  answer:null,
  points:0,
}
function reducer(state,action){
   switch(action.type){
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status:"Ready"
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
    default:
     throw new Error('Action Unknown')
   } 
}

function App() {

 const [{questions,status,index,answer,points},dispatch]=useReducer(reducer,initailState);
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
          <NextButton dispatch={dispatch} answer={answer}/>
          </>
          }
        </Main>
    </div>
  );
}

export default App;
