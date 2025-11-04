const fs = require('fs');
const path = require('path');

/**
 * CSV Parser Utility for CineVerse Movies Dataset
 * Converts CSV file to JSON format compatible with the application
 */

/**
 * Parse CSV file and convert to JSON
 * @param {string} csvFilePath - Path to CSV file
 * @returns {Array} Array of movie objects
 */
function parseCSV(csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse data rows
    const movies = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        console.warn(`Skipping row ${i + 1}: column count mismatch`);
        continue;
      }

      const movie = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Clean up value
        value = value.trim().replace(/^"|"$/g, '');
        
        // Map CSV headers to application format
        const mappedValue = mapCSVField(header, value);
        if (mappedValue !== null && mappedValue !== undefined) {
          movie[mapCSVHeader(header)] = mappedValue;
        }
      });

      // Ensure required fields
      if (movie.id && movie.title) {
        movies.push(movie);
      }
    }

    return movies;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
}

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

/**
 * Map CSV header names to application field names
 * @param {string} csvHeader - CSV column header
 * @returns {string} Mapped field name
 */
function mapCSVHeader(csvHeader) {
  const headerMap = {
    'ID': 'id',
    'id': 'id',
    'Rank': 'rank',
    'rank': 'rank',
    'Title': 'title',
    'title': 'title',
    'Year': 'year',
    'year': 'year',
    'Industry': 'category',
    'industry': 'category',
    'Category': 'category',
    'category': 'category',
    'Genre': 'genres',
    'genre': 'genres',
    'Genres': 'genres',
    'IMDb_Rating': 'imdb_rating',
    'imdb_rating': 'imdb_rating',
    'Director': 'director',
    'director': 'director',
    'Cast': 'cast',
    'cast': 'cast',
    'Worldwide_Gross_USD': 'worldwide_gross_usd',
    'worldwide_gross_usd': 'worldwide_gross_usd',
    'Worldwide_Gross_INR': 'worldwide_gross_inr',
    'worldwide_gross_inr': 'worldwide_gross_inr',
    'Language': 'language',
    'language': 'language',
    'Poster_URL': 'poster_url',
    'poster_url': 'poster_url',
    'Trailer_URL': 'trailer_url',
    'trailer_url': 'trailer_url',
    'Description': 'description',
    'description': 'description',
    'Movie_URL': 'source_urls',
    'movie_url': 'source_urls',
    'Source_URL': 'source_urls',
    'source_url': 'source_urls',
    'Country': 'country',
    'country': 'country',
    'Runtime': 'runtime',
    'runtime': 'runtime',
    'Certificate': 'certificate',
    'certificate': 'certificate',
    'Budget_INR': 'budget_inr',
    'budget_inr': 'budget_inr',
    'Budget_USD': 'budget_usd',
    'budget_usd': 'budget_usd',
    'Profit_INR': 'profit_inr',
    'profit_inr': 'profit_inr',
    'Awards': 'awards',
    'awards': 'awards',
    'Release_Date': 'release_date',
    'release_date': 'release_date',
    'Domestic_Gross_USD': 'domestic_gross_usd',
    'domestic_gross_usd': 'domestic_gross_usd',
    'Domestic_Gross_INR': 'domestic_gross_inr',
    'domestic_gross_inr': 'domestic_gross_inr'
  };

  return headerMap[csvHeader] || csvHeader.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Map and transform CSV field values
 * @param {string} header - CSV header name
 * @param {string} value - Field value
 * @returns {any} Transformed value
 */
function mapCSVField(header, value) {
  if (!value || value.trim() === '' || value === 'N/A' || value === 'NA') {
    return null;
  }

  const normalizedHeader = mapCSVHeader(header);

  // Handle numeric fields
  if (normalizedHeader.includes('gross') || 
      normalizedHeader.includes('budget') || 
      normalizedHeader.includes('profit') ||
      normalizedHeader === 'id' ||
      normalizedHeader === 'rank' ||
      normalizedHeader === 'year' ||
      normalizedHeader === 'imdb_rating') {
    const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? null : num;
  }

  // Handle array fields
  if (normalizedHeader === 'genres' || normalizedHeader === 'source_urls') {
    if (value.includes(',')) {
      return value.split(',').map(v => v.trim()).filter(v => v);
    }
    return value ? [value] : null;
  }

  // Handle date fields
  if (normalizedHeader === 'release_date') {
    return value;
  }

  // Handle boolean-like fields
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  // Default: return as string
  return value;
}

/**
 * Import CSV file and save to JSON
 * @param {string} csvFilePath - Path to CSV file
 * @param {string} jsonOutputPath - Path to output JSON file
 * @returns {Array} Array of imported movies
 */
function importCSVToJSON(csvFilePath, jsonOutputPath) {
  try {
    console.log(`📥 Importing CSV from: ${csvFilePath}`);
    
    const movies = parseCSV(csvFilePath);
    
    // Ensure IDs are sequential integers starting from 1
    movies.forEach((movie, index) => {
      movie.id = index + 1;
    });

    // Ensure output directory exists
    const outputDir = path.dirname(jsonOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(jsonOutputPath, JSON.stringify(movies, null, 2), 'utf8');
    
    console.log(`✅ Successfully imported ${movies.length} movies to ${jsonOutputPath}`);
    return movies;
  } catch (error) {
    console.error('❌ Error importing CSV:', error);
    throw error;
  }
}

/**
 * Validate movie data structure
 * @param {Object} movie - Movie object
 * @returns {boolean} True if valid
 */
function validateMovie(movie) {
  const requiredFields = ['id', 'title'];
  const hasRequiredFields = requiredFields.every(field => movie[field] !== undefined && movie[field] !== null);
  
  return hasRequiredFields;
}

module.exports = {
  parseCSV,
  importCSVToJSON,
  validateMovie,
  mapCSVHeader,
  mapCSVField
};

