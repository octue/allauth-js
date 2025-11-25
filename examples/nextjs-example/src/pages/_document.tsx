import { Head, Html, Main, NextScript } from 'next/document'

// Inline script to prevent flash of wrong theme on page load
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var isDark = theme === 'dark' ||
      (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
