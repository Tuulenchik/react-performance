import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { useMemo } from 'react';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
   const populationByCountryId = useMemo(() => {
    const populationMap = new Map<string, number>();

    countries.forEach((country) => {
      const yearDataMap = createYearDataMap(country.data);
      const population = getPopulationForYear(yearDataMap, selectedYear) || 0;

      populationMap.set(country.id, population);
    });

    return populationMap;
  }, [countries, selectedYear]);

  const filteredCountries = useMemo(() => {
    const normalizedSearchQuery = searchQuery.toLowerCase();

    return countries
      .filter((country) => {
        const matchesSearch = country.id.toLowerCase().includes(normalizedSearchQuery);
        const matchesRegion =
          !selectedRegion || country.data.some((dataItem) => dataItem.region === selectedRegion);

        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        }

        const populationA = populationByCountryId.get(a.id) || 0;
        const populationB = populationByCountryId.get(b.id) || 0;

        return sortOrder === 'asc' ? populationA - populationB : populationB - populationA;
      });
  }, [countries, searchQuery, selectedRegion, sortField, sortOrder, populationByCountryId]);

  return (
    <div className={styles.countryList}>
      {filteredCountries.map((country) => (
        <CountryCard
          key={country.id}
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      ))}
    </div>
  );
};
