// Crime Map Dataset Schema - Google Dataset Search Integration
// For indexing in Google Dataset Search (https://datasetsearch.research.google.com/)

interface CrimeDataPoint {
  latitude: number;
  longitude: number;
  type: string;
  date: string;
  location: string;
}

interface CrimeMapDatasetSchemaProps {
  totalIncidents?: number;
  lastUpdated?: string;
  startDate?: string;
  endDate?: string;
  sampleData?: CrimeDataPoint[];
}

export default function CrimeMapDatasetSchema({
  totalIncidents = 500,
  lastUpdated = new Date().toISOString(),
  startDate = "2024-01-01",
  endDate = new Date().toISOString().split('T')[0],
  sampleData = []
}: CrimeMapDatasetSchemaProps) {
  const baseUrl = "https://politie-forum.nl";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${baseUrl}/crime-map-nederland#dataset`,
    name: "Nederlandse Criminaliteitskaart - Politie Forum Nederland",
    description: "Interactieve kaart met meldingen van criminaliteit en incidenten in Nederland. Gebaseerd op openbare politieberichten en nieuwsbronnen. Real-time updates van incidenten, inbraken, overvallen, vernielingen en andere misdrijven.",
    url: `${baseUrl}/crime-map-nederland`,
    sameAs: [
      `${baseUrl}/crime-map-nederland`,
      "https://www.politie.nl/nieuws",
    ],
    keywords: [
      "criminaliteit Nederland",
      "politie meldingen",
      "incidenten kaart",
      "crime map",
      "veiligheid Nederland",
      "misdaad statistieken",
      "inbraak meldingen",
      "openbare orde",
      "geografische data",
    ],
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      "@id": `${baseUrl}/#org`,
      name: "Politie Forum Nederland",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${baseUrl}/#org`,
      name: "Politie Forum Nederland",
      url: baseUrl,
    },
    datePublished: startDate,
    dateModified: lastUpdated,
    temporalCoverage: `${startDate}/${endDate}`,
    spatialCoverage: {
      "@type": "Place",
      name: "Nederland",
      geo: {
        "@type": "GeoShape",
        box: "50.7503837 3.3316117 53.5547201 7.2274985", // Nederland bounding box (south, west, north, east)
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
      },
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/geo+json",
        contentUrl: `${baseUrl}/api/crime-map/geojson`,
        description: "GeoJSON formaat voor GIS-toepassingen",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${baseUrl}/api/crime-map/csv`,
        description: "CSV export van alle incidenten",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${baseUrl}/api/crime-map/json`,
        description: "JSON API endpoint voor developers",
      },
    ],
    measurementTechnique: "Automated aggregation of public police reports and news articles",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Incident Type",
        description: "Categorie van het gemelde incident (inbraak, overval, vernieling, etc.)",
        valueReference: "misdaadtype",
      },
      {
        "@type": "PropertyValue",
        name: "Location",
        description: "Geografische locatie (stad, straat) van het incident",
        valueReference: "locatie",
      },
      {
        "@type": "PropertyValue",
        name: "Date",
        description: "Datum en tijdstip van het incident",
        valueReference: "datum",
      },
      {
        "@type": "PropertyValue",
        name: "Coordinates",
        description: "WGS84 coördinaten (latitude, longitude)",
        valueReference: "geo",
      },
    ],
    numberOfItems: totalIncidents,
    version: "2.0",
    isBasedOn: [
      {
        "@type": "WebSite",
        name: "Politie.nl Nieuwsberichten",
        url: "https://www.politie.nl/nieuws",
      },
    ],
    citation: {
      "@type": "CreativeWork",
      name: "Politie Forum Nederland Crime Map Dataset",
      author: {
        "@id": `${baseUrl}/#org`,
      },
      datePublished: startDate,
    },
    // Optional: sample data for richer previews
    ...(sampleData.length > 0 && {
      workExample: sampleData.slice(0, 5).map((incident, index) => ({
        "@type": "DataRecord",
        "@id": `${baseUrl}/crime-map-nederland#sample-${index + 1}`,
        name: `${incident.type} in ${incident.location}`,
        geo: {
          "@type": "GeoCoordinates",
          latitude: incident.latitude,
          longitude: incident.longitude,
        },
        temporal: incident.date,
        description: `${incident.type} gemeld op ${incident.date} in ${incident.location}`,
      })),
    }),
    potentialAction: {
      "@type": "SearchAction",
      name: "Zoek incident op locatie",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/crime-map-nederland?search={search_term}`,
      },
      "query-input": "required name=search_term",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
