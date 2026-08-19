export default async function handler(req, res) {
  res.setHeader('Allow', 'POST');
  return res.status(410).json({
    error: 'This Career assessment endpoint has been retired.',
    replacement: '/api/career/submit-v2',
  });
}
