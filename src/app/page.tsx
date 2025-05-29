"use client";

import React from "react";
import Link from "next/link";
import styles from "./style.module.scss";

const Home: React.FC = () => (
  <div className={styles.container}>
    <Link href="/convert" className={styles.button}>
      엑셀 티커 → 한글명 변환 시작하기
    </Link>
  </div>
);

export default Home;
