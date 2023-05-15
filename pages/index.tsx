import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { user } = useUser();
  return (
    <div className={styles.container}>
      <Head>
        <title>Request API Demo</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://request.finance">Request Finance!</a>
        </h1>

        <div className={styles.grid}>
          {user ? (
            <>
              <Link href="/profile" className={styles.card}>
                <h2>Profile &rarr;</h2>
                <p>View your Request account</p>
              </Link>
              <Link href="/invoices" className={styles.card}>
                <h2>Invoices &rarr;</h2>
                <p>View your Request invoices</p>
              </Link>
              <Link href="/api/hello" className={styles.card}>
                <h2>API call &rarr;</h2>
                <p>Demo a Next.js API call</p>
              </Link>
              <Link href="/api/auth/logout" className={styles.card}>
                <h2>Logout &rarr;</h2>
                <p>Disconnect your account</p>
              </Link>
            </>
          ) : (
            <Link href="/api/auth/login" className={styles.card}>
              <h2>Login &rarr;</h2>
              <p>Using your Request Finance account.</p>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
