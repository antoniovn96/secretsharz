import { getCountries, getStates, getCities, filterStates, filterCities } from '../../../src/platform/globalLocation.js';

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendError(res, 405, 'Method not allowed.');
  }

  const type = typeof req.query?.type === 'string' ? req.query.type : 'countries';
  const countryId = req.query?.countryId;
  const stateId = req.query?.stateId;

  try {
    if (type === 'countries') {
      const countries = await getCountries();
      return res.status(200).json({ source: 'dr5hn/countries-states-cities-database', countries });
    }

    if (type === 'states') {
      if (!countryId) return sendError(res, 400, 'countryId is required.');
      const states = filterStates(await getStates(), countryId);
      return res.status(200).json({ source: 'dr5hn/countries-states-cities-database', states });
    }

    if (type === 'cities') {
      if (!stateId) return sendError(res, 400, 'stateId is required.');
      const cities = filterCities(await getCities(), stateId);
      return res.status(200).json({ source: 'dr5hn/countries-states-cities-database', cities });
    }

    return sendError(res, 400, 'Unknown location type. Use countries, states or cities.');
  } catch (error) {
    console.error('[global-location]', error);
    return sendError(res, 502, 'The global location database is temporarily unavailable.');
  }
}
