import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VidyaVantage from '../src/VidyaVantage';

export default function VidyaVantagePage() {
  const router = useRouter();
  const navigate = (path) => router.push(path);

  return (
    <>
      <Head>
        <title>VidyaVantage | Career Discovery & Guidance | Secret Sharz</title>
        <meta name="description" content="Explore career paths, take the Secret Sharz career assessment, compare streams and discover college pathways with VidyaVantage." />
      </Head>
      <VidyaVantage
        onBack={() => router.push('/')}
        navigate={navigate}
      />
    </>
  );
}
