import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Core listing document.
 *
 * Designed to be extensible: the `details` key/value array lets any listing
 * vertical (automotive, real estate, etc.) attach its own attributes without
 * schema migrations, while `defineType`/`defineField` keep future typed
 * additions type-safe and non-breaking.
 */
export const listing = defineType({
  name: 'listing',
  title: 'Listing',
  type: 'document',
  fields: [
    // Core fields — required/shared across every listing type.
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The listing name.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from the title.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Rich text description.',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Listed price.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: { list: ['AUD', 'USD', 'GBP', 'EUR', 'NZD'] },
      initialValue: 'AUD',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'sold', 'pending', 'draft'], layout: 'radio' },
      initialValue: 'active',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Multiple images supported. The first image is used as the hero/thumbnail.',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Free text for now — will become a reference later.',
    }),

    // Extensible key/value metadata. Supports text, number, boolean and date types
    // so values can be sorted/filtered (e.g. odometer, bedrooms, land size) while
    // remaining flexible enough to work across verticals like automotive and real estate.
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'detail',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. "Odometer", "Year", "Condition", "Bedrooms".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value (display)',
              type: 'string',
              description:
                'Human-readable display override, e.g. "142,000 km", "2019", "Good". ' +
                'For number values this can be derived from Value (number) + Unit, but an ' +
                'explicit value allows custom formatting.',
            }),
            defineField({
              name: 'valueType',
              title: 'Value type',
              type: 'string',
              description: 'How the value should be interpreted (drives sorting/filtering).',
              options: { list: ['text', 'number', 'boolean', 'date'], layout: 'radio' },
              initialValue: 'text',
            }),
            defineField({
              name: 'valueNumber',
              title: 'Value (number)',
              type: 'number',
              description:
                'Used when Value type is "number" (e.g. odometer 142000, bedrooms 3, ' +
                'year 2019). Kept separate from the display value for sorting and filtering.',
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
              description:
                'Optional display unit for number values (e.g. "km", "miles", "sqm", "acres").',
            }),
            defineField({
              name: 'valueBoolean',
              title: 'Value (boolean)',
              type: 'boolean',
              description: 'Used when Value type is "boolean" (e.g. "Has Pool", "Pet Friendly").',
            }),
            defineField({
              name: 'valueDate',
              title: 'Value (date)',
              type: 'string',
              description: 'ISO date string, used when Value type is "date".',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
    }),

    // Timestamps.
    defineField({
      name: 'listingDate',
      title: 'Listing date',
      type: 'datetime',
      description: 'When the listing was created/posted.',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated at',
      type: 'datetime',
      description: 'Last updated.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'images.0' },
  },
});
