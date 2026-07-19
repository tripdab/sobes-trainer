/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { questions } from '../data/questions.js';
import {
  calculateLevel,
  readStorageValue,
  writeStorageValue,
  shuffle,
} from '../utils.js';
import {
  BEST_RESULT_KEY,
  LAST_RESULT_KEY,
  ROUND_QUESTIONS_COUNT,
  SCREENS,
} from '../data/constants';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.START);

  const [selectedCategory, setSelectedCategory] = useState('mixed');
  const [roundQuestions, setRoundQuestions] = useState([]);

  const [result, setResult] = useState(null);

  const [bestResult, setBestResult] = useState(() =>
    readStorageValue(BEST_RESULT_KEY),
  );

  // Старт опроса
  const startQuiz = (activeCategory) => {
    // Получем вопросы нужной категории

    let sourceQuestions = questions;
    if (activeCategory !== 'mixed') {
      sourceQuestions = questions.filter(
        (question) => question.category === activeCategory,
      );
    }

    // Перемешать вопросы в рандомном порядке
    const randomOrderedQuetions = shuffle(sourceQuestions);

    // Выбрать нужное кол-во
    const countQuestions = randomOrderedQuetions.slice(
      0,
      ROUND_QUESTIONS_COUNT,
    );

    // Перемешиваем варианты ответов
    const randomOrderedAnswers = countQuestions.map((question) => {
      return {
        ...question,
        options: shuffle(question.options),
      };
    });

    // Установить как вопросы текущего раунда
    setRoundQuestions(randomOrderedAnswers);
    // setRoundQuestions(countQuestions);

    // Записываем выбранную категорию в состояние
    setSelectedCategory(activeCategory);

    // Очищаем результат
    setResult(null);

    // Следующий экран
    setScreen(SCREENS.QUIZ);
  };

  // Завершение опроса
  const finishQuiz = (answerRecords, finishedByTimeout = false) => {
    // Объект вида {id-вопроса: ответ на вопрос}
    const answerByQuestionId = answerRecords.reduce(
      (answers, record) => {
        return {
          ...answers,
          [record.questionId]: record.selectedAnswer,
        };
      },
      {},
    );

    // массив из объектов вопросов раунда вида {вопрос, выбранный ответ, верный или неверный ответ}
    const review = roundQuestions.map((question) => {
      const selectedAnswer = answerByQuestionId[question.id] || null;
      return {
        ...question,
        selectedAnswer,
        isCorrect: selectedAnswer === question.correctAnswer,
      };
    });

    // Статистика
    const correctCount = review.filter(
      (item) => item.isCorrect,
    ).length;
    const mistakes = review.filter((item) => !item.isCorrect);
    const percent = Math.round(
      (correctCount / roundQuestions.length) * 100,
    );

    // Объект с текущим результатом
    const nextResult = {
      id: crypto.randomUUID(),
      category: selectedCategory,
      total: roundQuestions.length,
      correctCount,
      mistakesCount: mistakes.length,
      percent,
      level: calculateLevel(percent),
      mistakes,
      finishedByTimeout,
      completedAt: new Date().toISOString(),
    };

    writeStorageValue(LAST_RESULT_KEY, nextResult);

    // Если нет лучшего результата или текущий результат больше "лучшего", то запиываем его в "лучший" результат
    if (!bestResult || nextResult.percent >= bestResult.percent) {
      writeStorageValue(LAST_RESULT_KEY, nextResult);
      setBestResult(nextResult);
    }

    // Переход к экрану с результатом
    setResult(nextResult);
    setScreen(SCREENS.RESULT);
  };

  // Начать опрос заново
  const restartQuiz = () => {
    setScreen(SCREENS.START);
    setResult(null);
  };

  return (
    <QuizContext
      value={{
        startQuiz,
        screen,
        roundQuestions,
        finishQuiz,
        result,
        restartQuiz,
        bestResult,
      }}>
      {children}
    </QuizContext>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error('useQuiz must be used inside QuizProvider');
  }

  return context;
}
