import { useQuiz } from '../providers/QuizProvider';
import { categories } from '../data/categories';
import Card from './Card';

const ResultScreen = () => {
  const { result, restartQuiz } = useQuiz();

  const categoryLabel = categories.find(
    (category) => category.value === result.category,
  )?.label;

  return (
    <section className='space-y-10'>
      {/* Шапка */}
      <div className='grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end'>
        {/* Левая часть */}
        <div>
          <span className='badge mb-5'>ROUND COMPLETED</span>
          <h1 className='text-5xl font-bold leading-[1.15] sm:text-6xl'>
            Результат собеседования
          </h1>
        </div>

        {/* Правая часть */}
        <div className='space-y-4 text-lg text-zinc-600 dark:text-zinc-300'>
          <p>Категория: {categoryLabel}</p>
          <p>{result.level}</p>
        </div>
      </div>
      {/* Карточки */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card title='Correct' value={result.correctCount} />
        <Card title='Errors' value={result.mistakesCount} />
        <Card title='Score' value={`${result.percent}%`} />
      </div>
      {/* Результат */}
      <div className='card p-6 sm:p-8'>
        {/* Заголовок */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <span className='badge mb-4'>Review</span>
            <h2 className='text-3xl font-bold leading-tight'>
              Ошибки и пропущенные вопросы
            </h2>
          </div>
          <button
            className='ghost-button w-full sm:w-auto'
            type='button'
            onClick={restartQuiz}>
            Пройти ещё раз
          </button>
        </div>
        {/* Пояснения к вопросам */}

        {result.mistakes.length > 0 ? (
          <div className='grid gap-4'>
            {result.mistakes.map((item) => (
              <article
                key={item.id}
                className='rounded-lg border border-line p-5 dark:border-zinc-800'>
                <div className='mb-3 flex flex-wrap items-center gap-3'>
                  <span className='badge'>{item.category}</span>
                  <span className='text-zinc-500 dark:text-zinc-400'>
                    Ваш ответ: {item.selectedAnswer || 'нет ответа'}
                  </span>
                </div>
                <h3 className='text-xl font-bold leading-snug'>
                  {item.question}
                </h3>
                <p className='mt-3 font-semibold text-success'>
                  Правильный ответ: {item.correctAnswer}
                </p>
                <p className='mt-2 text-zinc-600 dark:text-zinc-300'>
                  {item.explanation}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className='text-zinc-500 dark:text-zinc-400'>
            Ошибок нет. Все вопросы в этом раунде решены верно.
          </p>
        )}
      </div>
    </section>
  );
};

export default ResultScreen;
