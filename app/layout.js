import "./globals.css";

export const metadata = {
    title: "HR Management System",
    description: "A simple HRMS application",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
