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

    // Extensible key/value metadata: any listing type can add custom attributes
    // here (e.g. Odometer, Year, Condition, Bedrooms) without schema changes.
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
              title: 'Value',
              type: 'string',
              description: 'e.g. "142,000 km", "2019", "Good", "3".',
              validation: (Rule) => Rule.required(),
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
