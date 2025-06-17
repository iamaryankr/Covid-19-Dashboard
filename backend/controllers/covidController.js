const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });
const data  = require('../data/sampleData.json');

function computeGlobal(arr) {
  return arr.reduce((acc,c) => {
    acc.totalCases  += c.totalCases||0;
    acc.activeCases += c.activeCases||0;
    acc.recovered   += c.recovered||0;
    acc.deaths      += c.deaths||0;
    acc.vaccinated  += c.vaccinated||0;
    return acc;
  }, { totalCases:0, activeCases:0, recovered:0, deaths:0, vaccinated:0 });
}

exports.getGlobalSummary = (req,res) => {
  if (cache.has('global')) return res.json(cache.get('global'));
  const summary = computeGlobal(data);
  cache.set('global', summary);
  res.json(summary);
};

exports.getAllCountries = (req,res) => {
  if (cache.has('countries')) return res.json(cache.get('countries'));
  const list = data.map(c => ({
    country:     c.country,
    totalCases:  c.totalCases||0,
    activeCases: c.activeCases||0,
    recovered:   c.recovered||0,
    deaths:      c.deaths||0,
    vaccinated:  c.vaccinated||0
  }));
  cache.set('countries', list);
  res.json(list);
};

exports.getCountryData = (req,res) => {
  const name = req.params.name.toLowerCase();
  const key  = `country-${name}`;
  if (cache.has(key)) return res.json(cache.get(key));
  const country = data.find(c => c.country.toLowerCase() === name);
  if (!country) return res.status(404).json({ message:'Not found' });
  cache.set(key, country);
  res.json(country);
};
