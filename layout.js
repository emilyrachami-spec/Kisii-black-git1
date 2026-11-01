import './globals.css';

export const metadata = {
  title: 'Kisii Meet Hub — Connect. Unlock. Meet.',
  description: 'Meet real people in Kisii, Nyamira & surrounding areas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#16a34a" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-100 font-sans antialiased">
        <div className="min-h-screen max-w-lg mx-auto bg-white shadow-2xl relative">
          {children}
        </div>
      </body>
    </html>
  );
}
