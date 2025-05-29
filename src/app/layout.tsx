// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "업비트 티커 변환기",
  description: "엑셀 파일의 업비트 티커를 한글명으로 손쉽게 변환합니다.",
};

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="ko">
      <head />
      <body className="min-h-screen bg-gray-50 text-gray-800">
        {/* 헤더 */}
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
            <h1 className="text-2xl font-semibold">업비트 티커 변환기</h1>
          </div>
        </header>

        {/* 메인 */}
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>

        {/* 푸터 */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
