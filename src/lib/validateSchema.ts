// src/lib/validateSchema.ts
// Development-time schema validation with detailed warnings
// Ensures all required fields are present and @id references are correct

export interface SchemaValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  schema?: any;
}

interface ValidationRule {
  type: string;
  required: string[];
  recommended?: string[];
}

// ============================================================================
// VALIDATION RULES PER SCHEMA TYPE
// ============================================================================

const VALIDATION_RULES: ValidationRule[] = [
  {
    type: 'NewsArticle',
    required: ['headline', 'datePublished', 'author', 'publisher', 'image'],
    recommended: ['dateModified', 'articleBody', 'articleSection', 'keywords'],
  },
  {
    type: 'BlogPosting',
    required: ['headline', 'datePublished', 'author', 'publisher'],
    recommended: ['image', 'articleBody', 'keywords'],
  },
  {
    type: 'DiscussionForumPosting',
    required: ['headline', 'text', 'author', 'datePublished'],
    recommended: ['commentCount', 'interactionStatistic'],
  },
  {
    type: 'FAQPage',
    required: ['mainEntity'],
    recommended: [],
  },
  {
    type: 'HowTo',
    required: ['name', 'step'],
    recommended: ['description', 'image', 'totalTime'],
  },
  {
    type: 'Event',
    required: ['name', 'startDate', 'location'],
    recommended: ['endDate', 'description', 'image', 'organizer'],
  },
  {
    type: 'Organization',
    required: ['name', 'url'],
    recommended: ['logo', 'contactPoint', 'sameAs'],
  },
  {
    type: 'WebSite',
    required: ['name', 'url', 'publisher'],
    recommended: ['description', 'potentialAction'],
  },
  {
    type: 'ProfilePage',
    required: ['mainEntity'],
    recommended: [],
  },
  {
    type: 'CollectionPage',
    required: ['name', 'mainEntity'],
    recommended: ['description'],
  },
  {
    type: 'ClaimReview',
    required: ['claimReviewed', 'reviewRating', 'author', 'datePublished'],
    recommended: ['itemReviewed'],
  },
];

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateRequiredFields(schema: any, rule: ValidationRule): string[] {
  const errors: string[] = [];

  for (const field of rule.required) {
    if (!schema[field]) {
      errors.push(`[${rule.type}] Missing required field: ${field}`);
    }
  }

  return errors;
}

function validateRecommendedFields(schema: any, rule: ValidationRule): string[] {
  const warnings: string[] = [];

  if (!rule.recommended) return warnings;

  for (const field of rule.recommended) {
    if (!schema[field]) {
      warnings.push(`[${rule.type}] Missing recommended field: ${field} (improves SEO)`);
    }
  }

  return warnings;
}

function validateIdReferences(graph: any[], baseUrl: string): string[] {
  const warnings: string[] = [];
  const definedIds = new Set<string>();
  const referencedIds = new Set<string>();

  // Collect all defined @id values
  function collectIds(obj: any, path = '') {
    if (!obj || typeof obj !== 'object') return;

    if (obj['@id']) {
      definedIds.add(obj['@id']);
    }

    for (const [key, value] of Object.entries(obj)) {
      if (key === '@id') continue;

      if (typeof value === 'object' && value !== null) {
        // Check for @id references
        if (typeof value === 'object' && '@id' in value && Object.keys(value).length === 1) {
          referencedIds.add(value['@id']);
        }
        collectIds(value, `${path}.${key}`);
      } else if (Array.isArray(value)) {
        value.forEach((item, idx) => collectIds(item, `${path}.${key}[${idx}]`));
      }
    }
  }

  graph.forEach((schema) => collectIds(schema));

  // Check for broken references
  referencedIds.forEach((id) => {
    if (!definedIds.has(id)) {
      warnings.push(`Broken @id reference: "${id}" is referenced but not defined`);
    }
  });

  return warnings;
}

function validateImageUrls(schema: any): string[] {
  const warnings: string[] = [];

  function checkImageUrl(url: string, context: string) {
    if (!url) {
      warnings.push(`${context}: Image URL is empty`);
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      warnings.push(`${context}: Image URL should be absolute (${url})`);
    }

    if (url.includes('default') || url.includes('placeholder')) {
      warnings.push(`${context}: Using placeholder image (${url})`);
    }
  }

  function traverse(obj: any, path = '') {
    if (!obj || typeof obj !== 'object') return;

    if (obj['@type'] === 'ImageObject' && obj.url) {
      checkImageUrl(obj.url, `${path || 'Schema'} > ImageObject`);
    }

    if (obj.image) {
      if (typeof obj.image === 'string') {
        checkImageUrl(obj.image, `${obj['@type'] || 'Schema'} > image`);
      } else if (Array.isArray(obj.image)) {
        obj.image.forEach((img: any, idx: number) => {
          if (typeof img === 'string') {
            checkImageUrl(img, `${obj['@type']} > image[${idx}]`);
          }
        });
      }
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        traverse(value, `${path}.${key}`);
      }
    }
  }

  traverse(schema);
  return warnings;
}

function validateDates(schema: any): string[] {
  const warnings: string[] = [];

  function isValidDate(dateString: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  function checkDate(date: string, field: string, schemaType: string) {
    if (!isValidDate(date)) {
      warnings.push(`[${schemaType}] Invalid date format in ${field}: ${date}`);
    }
  }

  if (schema.datePublished) {
    checkDate(schema.datePublished, 'datePublished', schema['@type']);
  }

  if (schema.dateModified) {
    checkDate(schema.dateModified, 'dateModified', schema['@type']);

    if (schema.datePublished && schema.dateModified) {
      const published = new Date(schema.datePublished);
      const modified = new Date(schema.dateModified);

      if (modified < published) {
        warnings.push(
          `[${schema['@type']}] dateModified (${schema.dateModified}) is before datePublished (${schema.datePublished})`
        );
      }
    }
  }

  if (schema.startDate) {
    checkDate(schema.startDate, 'startDate', schema['@type']);
  }

  if (schema.endDate) {
    checkDate(schema.endDate, 'endDate', schema['@type']);

    if (schema.startDate && schema.endDate) {
      const start = new Date(schema.startDate);
      const end = new Date(schema.endDate);

      if (end < start) {
        warnings.push(
          `[${schema['@type']}] endDate (${schema.endDate}) is before startDate (${schema.startDate})`
        );
      }
    }
  }

  return warnings;
}

function validateAuthorPublisher(schema: any): string[] {
  const warnings: string[] = [];

  if (schema.author) {
    if (typeof schema.author === 'string') {
      warnings.push(`[${schema['@type']}] author should be an object with @type Person, not a string`);
    } else if (!schema.author['@type']) {
      warnings.push(`[${schema['@type']}] author missing @type`);
    }
  }

  if (schema.publisher) {
    if (typeof schema.publisher === 'string') {
      warnings.push(`[${schema['@type']}] publisher should be an object or @id reference, not a string`);
    }
  }

  return warnings;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

export function validateSchema(schemaGraph: any, options: { strict?: boolean } = {}): SchemaValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    if (!schemaGraph || !schemaGraph['@graph']) {
      errors.push('Schema must have @graph property');
      return { valid: false, warnings, errors };
    }

    const graph = schemaGraph['@graph'];

    if (!Array.isArray(graph)) {
      errors.push('@graph must be an array');
      return { valid: false, warnings, errors };
    }

    // Validate each schema in the graph
    for (const schema of graph) {
      const schemaType = schema['@type'];

      if (!schemaType) {
        warnings.push('Schema missing @type property');
        continue;
      }

      // Find validation rule for this type
      const rule = VALIDATION_RULES.find((r) => r.type === schemaType);

      if (rule) {
        // Check required fields
        const fieldErrors = validateRequiredFields(schema, rule);
        errors.push(...fieldErrors);

        // Check recommended fields (warnings only)
        const fieldWarnings = validateRecommendedFields(schema, rule);
        warnings.push(...fieldWarnings);
      }

      // Validate dates
      const dateWarnings = validateDates(schema);
      warnings.push(...dateWarnings);

      // Validate author/publisher
      const authorWarnings = validateAuthorPublisher(schema);
      warnings.push(...authorWarnings);

      // Validate images
      const imageWarnings = validateImageUrls(schema);
      warnings.push(...imageWarnings);
    }

    // Validate @id references across all schemas
    const idWarnings = validateIdReferences(graph, 'https://politie-forum.nl');
    warnings.push(...idWarnings);

    const valid = errors.length === 0 && (!options.strict || warnings.length === 0);

    return {
      valid,
      warnings,
      errors,
      schema: schemaGraph,
    };
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    return { valid: false, warnings, errors };
  }
}

// ============================================================================
// DEVELOPMENT-ONLY LOGGER
// ============================================================================

export function logValidationResults(result: SchemaValidationResult, pathname: string) {
  if (process.env.NODE_ENV !== 'development') return;

  console.group(`🔍 Schema Validation: ${pathname}`);

  if (result.valid && result.warnings.length === 0 && result.errors.length === 0) {
    console.log('✅ Schema is valid with no warnings');
  } else {
    if (result.errors.length > 0) {
      console.error('❌ Errors:');
      result.errors.forEach((err) => console.error(`  - ${err}`));
    }

    if (result.warnings.length > 0) {
      console.warn('⚠️  Warnings:');
      result.warnings.forEach((warn) => console.warn(`  - ${warn}`));
    }
  }

  console.groupEnd();
}

// ============================================================================
// AUTO-FIX UTILITIES (Optional)
// ============================================================================

export function autoFixSchema(schema: any): { fixed: any; changes: string[] } {
  const changes: string[] = [];
  const fixed = JSON.parse(JSON.stringify(schema)); // Deep clone

  // Auto-fix common issues
  if (fixed['@graph']) {
    fixed['@graph'].forEach((item: any) => {
      // Fix string authors to Person objects
      if (item.author && typeof item.author === 'string') {
        const name = item.author;
        item.author = { '@type': 'Person', name };
        changes.push(`Converted author string "${name}" to Person object`);
      }

      // Add missing dateModified (copy from datePublished)
      if (item.datePublished && !item.dateModified) {
        item.dateModified = item.datePublished;
        changes.push(`Added missing dateModified (copied from datePublished)`);
      }

      // Ensure image is absolute URL
      if (item.image && typeof item.image === 'string' && item.image.startsWith('/')) {
        item.image = `https://politie-forum.nl${item.image}`;
        changes.push(`Converted relative image URL to absolute`);
      }
    });
  }

  return { fixed, changes };
}
