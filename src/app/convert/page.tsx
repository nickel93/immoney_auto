"use client";

import { useState } from "react";
import ExcelJS from "exceljs";
import axios from "axios";
import { saveAs } from "file-saver";

const ConvertPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null);

  const onConvert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1) 업로드된 파일 로드
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // 2) 업비트 시장 코드 → 한글명 매핑 테이블 생성
      const { data: markets } = await axios.get<
        { market: string; korean_name: string }[]
      >("https://api.upbit.com/v1/market/all", {
        params: { isDetails: false },
      });
      const nameMap = new Map(
        markets.map(
          (m) =>
            [
              m.market.split("-").reverse().join(""), // "KRW-BTC" → "BTCKRW"
              m.korean_name,
            ] as [string, string]
        )
      );

      // 3) 첫 번째 시트: A열 전체 행 → D열
      const sheet1 = workbook.worksheets[0];
      sheet1.eachRow((row) => {
        const ticker = String(row.getCell(1).value || "")
          .trim()
          .toUpperCase();
        if (ticker) {
          const kr = nameMap.get(ticker) ?? "Unknown";
          row.getCell(4).value = kr;
        }
      });

      // 4) 두 번째 시트: 9행(Row 9)부터 C열 → D열
      const sheet2 = workbook.worksheets[1];
      sheet2.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber < 9) return;
        const ticker = String(row.getCell(3).value || "")
          .trim()
          .toUpperCase();
        if (ticker) {
          const kr = nameMap.get(ticker) ?? "Unknown";
          row.getCell(4).value = kr;
        }
      });

      // 5) 워크북을 버퍼로 쓰고 다운로드
      const outBuf = await workbook.xlsx.writeBuffer();
      const blob = new Blob([outBuf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, file.name.replace(/\.xlsx?$/, "") + "_한글명_변환.xlsx");
    } catch (err) {
      console.error(err);
      alert("변환 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        업비트 티커 → 한글명 변환 (스타일 보존)
      </h1>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={onFileChange}
        className="block mb-3"
      />
      <button
        onClick={onConvert}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "변환 중…" : "변환 & 다운로드"}
      </button>
    </div>
  );
};

export default ConvertPage;
