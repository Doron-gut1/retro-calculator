import React from 'react';
import { Property } from '../../types/property';

interface SearchResultsProps {
  results: Property[];
  onSelect: (property: Property) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect }) => {
  if (results.length === 0) return null;

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
      {results.map((property) => (
        <button
          key={property.hskod}
          className="w-full px-4 py-2 text-right hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          onClick={() => onSelect(property)}
        >
          <div className="font-medium">{property.hskod}</div>
          <div className="text-sm text-gray-600">{property.ktovet}</div>
        </button>
      ))}
    </div>
  );
};

export default SearchResults;