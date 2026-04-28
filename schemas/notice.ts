import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'notice',
  title: '공지사항',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: '작성자',
      type: 'reference',
      to: [{ type: 'author' }]
    }),
    defineField({
      name: 'content',
      title: '내용',
      type: 'text'
    }),
    defineField({
      name: 'isPinned',
      title: '고정글',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'createdAt',
      title: '작성일',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'attachment',
      title: '첨부파일',
      type: 'array',
      of: [{ type: 'file' }]
    }),
    defineField({
      name: 'slug',
      title: '슬러그(url생성)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // 공백 → -
            .replace(/[^\w\-가-힣]+/g, '') // 특수문자 제거 (한글 허용)
            .replace(/\-\-+/g, '-'),     // -- → -
      },
      validation: (Rule) => Rule.required(),
    }),
  ]
})