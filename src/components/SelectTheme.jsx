import { useEffect, useState } from 'react';

const THEME_KEY = 'react-trainer:theme';

function getInitialThemeMode() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const SelectTheme = () => {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);

  // Изменение темы страницы на основе состояния themeMode или системной темы
  useEffect(() => {
    const shouldUseDarkThrme = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);
    document.documentElement.classList.toggle('dark', shouldUseDarkThrme);

    localStorage.setItem(THEME_KEY, themeMode);
  }, [themeMode, systemPrefersDark]);

  // Прослушка изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemPrefersDark(event.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  return (
    <select
      value={themeMode}
      onChange={(e) => setThemeMode(e.target.value)}
      className='rounded-full border border-line bg-transparent px-4 py-2 pr-4 text-base font-medium outline-none transition-colors hover:border-ink dark:border-zinc-700 dark:hover:border-paper'>
      <option value='system'>Системная</option>
      <option value='light'>Светлая</option>
      <option value='dark'>Тёмная</option>
    </select>
  );
};

export default SelectTheme;
