
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');

        const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
});
