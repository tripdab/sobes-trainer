import { useEffect, useState } from 'react';
import { useQuiz } from '../providers/QuizProvider';
import QuestionCard from './QuestionCard';
import { useCountdown } from '../hooks/useCountdown';
import {
  ROUND_QUESTIONS_COUNT,
  ROUND_TIME_SECONDS,
} from '../data/constants';
import Timer from './Timer';
import ProgressBar from './ProgressBar';


const QuizScreen = () => {
  const { roundQuestions, finishQuiz } = useQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerRecords, setAnswerRecords] = useState([]);

  const { timeLeft, isExpired } = useCountdown(ROUND_TIME_SECONDS);

  const currentQuestion = roundQuestions[currentIndex];
  const isLastQuestion = currentIndex === roundQuestions.length - 1;

  // Когда время вышло — досдаём текущий ответ (если выбран) и завершаем раунд.
  useEffect(() => {
    if (!isExpired) return;

    const records = selectedAnswer
      ? [
          ...answerRecords,
          { questionId: currentQuestion.id, selectedAnswer },
        ]
      : answerRecords;

    finishQuiz(records, true);
  }, [
    isExpired,
    selectedAnswer,
    answerRecords,
    currentQuestion,
    finishQuiz,
  ]);

  const progressPercent = Math.round(
    ((currentIndex + Number(Boolean(selectedAnswer))) /
      roundQuestions.length) *
      100,
  );

  const handleSelectAnswer = (answer) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answer);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const allRecords = [
        ...answerRecords,
        { questionId: currentQuestion.id, selectedAnswer },
      ];
      finishQuiz(allRecords, false);
      return;
    }

    setAnswerRecords((prev) => {
      return [
        ...prev,
        { questionId: currentQuestion.id, selectedAnswer },
      ];
    });
    setSelectedAnswer(null);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section className='mx-auto max-w-4xl space-y-7'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='badge mb-3'>
            Вопрос {currentIndex + 1} / {ROUND_QUESTIONS_COUNT}
          </span>
          <h2 className='text-3xl font-bold leading-tight'>
            Раунд собеседования
          </h2>
        </div>
        <div>
          <Timer seconds={timeLeft} />
        </div>
      </div>

      <ProgressBar value={progressPercent} />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        handleSelectAnswer={handleSelectAnswer}
        selectedAnswer={selectedAnswer}
      />

      <div className='flex justify-end'>
        <button
          className='primary-button w-full sm:w-auto'
          type='button'
          disabled={!selectedAnswer}
          onClick={handleNextQuestion}>
          {isLastQuestion ? 'Показать результат' : 'Следующий вопрос'}
        </button>
      </div>
    </section>
  );
};

export default QuizScreen;
