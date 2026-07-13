// import { useState } from 'react';
import Header from './components/Header';
import ResultScreen from './components/ResultScreen';
import QuizScreen from './components/QuizScreen';
import StartScreen from './components/StartScreen';
import { useQuiz } from './providers/QuizProvider';
import { SCREENS } from './data/constants';

const App = () => {
  const { screen } = useQuiz();
  return (
    <div className='page-wrapper'>
      <Header />
      <main className='mx-auto max-w-6xl px-5 py-10 sm:py-14'>
        {screen === SCREENS.START && <StartScreen />}
        {screen === SCREENS.QUIZ && <QuizScreen />}
        {screen === SCREENS.RESULT && <ResultScreen />}
      </main>
    </div>
  );
};

export default App;
