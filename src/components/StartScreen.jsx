import { useState } from 'react';
import { categories } from '../data/categories';
import {
  ROUND_QUESTIONS_COUNT,
  ROUND_TIME_SECONDS,
} from '../data/constants';
import { useQuiz } from '../providers/QuizProvider.jsx';

const ROUND_MINUTES = Math.floor(ROUND_TIME_SECONDS / 60);
const ROUND_SECONDS = ROUND_TIME_SECONDS - 60 * ROUND_MINUTES;

const formatTime = (value) => String(value).padStart(2, 0);
const ROUND_TIME_LABEL = `${formatTime(ROUND_MINUTES)}:${formatTime(ROUND_SECONDS)}`;

const StartScreen = () => {
  const [activeCategory, setActiveCategory] = useState('mixed');

  const { startQuiz, bestResult } = useQuiz();

  const bestResultCategory = categories.find(
    (category) => category.value === bestResult?.category,
  )?.label;

  return (
    <section className='space-y-12'>
      {/* Заголовок */}
      <div className='grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end'>
        <div>
          <span className='badge mb-5'>Frontend практика</span>
          <h1 className='max-w-3xl text-5xl font-bold leading-[1.15] tracking-normal sm:text-6xl'>
            Тренажер Frontend собеседований
          </h1>
        </div>

        <div className='space-y-5 text-lg text-zinc-600 dark:text-zinc-300'>
          <p> 20 вопросов / 10 минут</p>
          <p>
            Быстрый учебный раунд без регистрации. Выберите тему,
            ответьте на вопросы и разберите ошибки сразу после
            завершения.
          </p>
        </div>
      </div>
      {/* Контент */}
      <div className='grid gap-8 lg:grid-cols-[1fr_340px]'>
        {/* Левая часть */}
        <div className='card p-6 sm:p-8'>
          {/* Категории */}
          <div className='mb-8 flex flex-wrap gap-x-8 gap-y-3'>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-tab ${cat.value === activeCategory ? 'category-tab-active' : ''}`}
                type='button'
                onClick={() => setActiveCategory(cat.value)}>
                {cat.label}
              </button>
            ))}
          </div>
          {/* Инфо карточки  */}
          <div className='grid gap-4 sm:grid-cols-2'>
            {/* Кол-во вопросов */}
            <div className='rounded-lg border border-line bg-soft p-5 dark:border-zinc-800 dark:bg-zinc-900'>
              <span className='badge mb-4'>Раунд</span>
              <p className='text-3xl font-bold leading-tight'>
                {' '}
                {ROUND_QUESTIONS_COUNT} вопросов
              </p>
              <p className='mt-2 text-zinc-500 dark:text-zinc-400'>
                Только один вариант ответа в каждом вопросе.
              </p>
            </div>

            {/* Время раунда  */}
            <div className='rounded-lg border border-line bg-soft p-5 dark:border-zinc-800 dark:bg-zinc-900'>
              <span className='badge mb-4'>Timer</span>
              <p className='text-3xl font-bold leading-tight'>
                {ROUND_TIME_LABEL}
              </p>
              <p className='mt-2 text-zinc-500 dark:text-zinc-400'>
                Таймер стартует после нажатия кнопки.
              </p>
            </div>
          </div>

          {/* Начать */}
          <button
            className='primary-button mt-8 w-full sm:w-auto'
            type='button'
            onClick={() => startQuiz(activeCategory)}>
            Начать собеседование
          </button>
        </div>
        {/* Правая часть */}
        <aside className='card p-6'>
          <span className='badge mb-5'>Лучший результат</span>

          {bestResult ? (
            <div className='space-y-4'>
              <p className='text-5xl font-bold leading-none'>
                {bestResult.percent}%
              </p>
              <p className='text-zinc-600 dark:text-zinc-300'>
                {bestResult.correctCount} из {bestResult.total}{' '}
                правильных
              </p>
              <p className='text-zinc-500 dark:text-zinc-400'>
                Категория: {bestResultCategory}. <br />
                Уровень: {''}
                {bestResult.level}.
              </p>
            </div>
          ) : (
            <p className='text-zinc-500 dark:text-zinc-400'>
              Лучший результат появится здесь после первого
              завершённого раунда.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
};

export default StartScreen;
