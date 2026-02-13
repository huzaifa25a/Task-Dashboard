import "./globals.css";

export const metadata = {
  title: "Task Dashboard App",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
