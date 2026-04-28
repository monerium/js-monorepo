import React, { FC, useEffect, useState } from 'react';

export interface ApiCountry {
  name: string;
  code: string;
  nationality: string;
  residency: string;
}

export interface ApiCountriesResponse {
  countries: ApiCountry[];
  total: number;
}

let countriesCache: ApiCountry[] | null = null;
let fetchPromise: Promise<ApiCountry[]> | null = null;

export interface CountryListProps {
  type: 'nationality' | 'residency';
  tier: string;
}

export const CountryList: FC<CountryListProps> = ({ type, tier }) => {
  const [countries, setCountries] = useState<ApiCountry[]>(countriesCache || []);
  const [loading, setLoading] = useState<boolean>(!countriesCache);

  useEffect(() => {
    if (countriesCache) {
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetch('https://api.monerium.app/countries')
        .then((res) => res.json())
        .then((data: ApiCountriesResponse) => {
          countriesCache = data.countries;
          return countriesCache;
        })
        .catch((err) => {
          console.error('Failed to fetch countries:', err);
          return [];
        });
    }

    fetchPromise.then((data) => {
      setCountries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <span>Loading...</span>;
  }

  const filtered = countries
    .filter((c) => c[type] === tier)
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));

  return <span>{filtered.join(', ')}</span>;
};

export default CountryList;
