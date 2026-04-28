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
      type: 'file'  
    }),
  ]
})