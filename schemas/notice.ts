import { defineType, defineField } from "sanity";
import AutoSlugInput from "../components/AutoSlugInput";

export default defineType({
  name: "notice",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "작성자",
      type: "reference",
      to: [{ type: "author" }],
    }),

    defineField({
      name: "content",
      title: "내용",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "본문", value: "normal" },
            { title: "제목", value: "h2" },
            { title: "소제목", value: "h3" },
          ],
          lists: [{ title: "리스트", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "링크",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "alt 텍스트",
            },
          ],
        },
      ],
    }),

    defineField({
      name: "isPinned",
      title: "고정글",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "createdAt",
      title: "작성일",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "images",
      title: "썸네일",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "alt 텍스트",
            },
          ],
        },
      ],
    }),

    defineField({
      name: "attachment",
      title: "첨부파일",
      type: "array",
      of: [
        {
          type: "file",
          title: "파일",
        },
      ],
    }),

    defineField({
      name: "slug",
      title: "슬러그",
      type: "slug",
      components: {
        input: AutoSlugInput,
      },
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
  ],
});