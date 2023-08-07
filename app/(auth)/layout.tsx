import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Yarn",
  description: "A Next.js 13 Meta Yarn Application",
};

type Props = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

const layout = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default layout;
