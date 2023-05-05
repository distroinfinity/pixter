import Head from "next/head";
import type { NextPage } from "next";

const PageNotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pixter: 404</title>
        <meta name="description" content="Create your very own Web3 Avatar" />
      </Head>

      <div className="text-3xl mx-auto mt-8">PAGE NOT FOUND!</div>
    </>
  );
};

export default PageNotFound;