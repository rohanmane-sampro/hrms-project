import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
    title: "Pro HRMS | Advanced Team Management",
    description: "Next-generation HR management system for modern enterprises",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
