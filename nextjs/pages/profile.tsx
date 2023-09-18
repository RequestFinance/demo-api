import React from "react";
import { UserProfile } from "@auth0/nextjs-auth0";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function Profile({ user }: { user: UserProfile }) {
  return (
    <div className={styles.main}>
      <Image
        src={String(user.picture)}
        width={300}
        height={300}
        alt={user.name || ""}
      />
      <h2>{user.name}</h2>
      <p>{user.email}</p>

      <p>
        <Link href="/">Back to Home</Link>
      </p>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
