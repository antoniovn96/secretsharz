export async function getServerSideProps({ res }) {
  res.statusCode = 200;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return { props: {} };
}

export default function HealthzPage() {
  return null;
}
