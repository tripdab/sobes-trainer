import SelectTheme from './SelectTheme';

const Header = () => {
  return (
    <header className='app-header'>
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4'>
        <a href='/' className='text-lg font-bold tracking-normal'>
          Тренажер Собеседований
        </a>
        <SelectTheme />
      </div>
    </header>
  );
};

export default Header;
