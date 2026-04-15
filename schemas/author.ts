import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: '작성자',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'role',
      title: '역할',
      type: 'string'
    }),
    defineField({
      name: 'image',
      title: '프로필 이미지',
      type: 'image'
    })
  ]
})