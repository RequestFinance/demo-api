import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import Link from "next/link";
const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  const res = await response.json();
  if (response.status !== 200) {
    throw new Error(res.errors);
  }
  return res;
};

export default function Invoices({
  invoices,
}: {
  invoices: { id: string; requestId: string }[];
}) {
  return (
    <div>
      {!Array.isArray(invoices) || invoices.length === 0 ? (
        <>No Result.</>
      ) : (
        <ul>
          {invoices.map((invoice: any) => (
            <li key={invoice.id}>{invoice.requestId}</li>
          ))}
        </ul>
      )}
      <div>
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await withPageAuthRequired()(ctx);
  if (!("props" in res)) {
    return res;
  }

  const { accessToken } = await getAccessToken(ctx.req, ctx.res, {
    refresh: true,
  });
  const response = await fetch("https://api.request.finance/invoices", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Network": "test",
    },
  });

  const invoices = await response.json();
  return {
    props: { ...res.props, invoices },
  };
};
