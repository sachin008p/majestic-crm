export const applyTheme = (theme = 'light') => {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(nextTheme);
  return nextTheme;
};
