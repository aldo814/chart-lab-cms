import { defineType, defineField } from "sanity";

const slugify = (input: string) =>
  input
    ?.toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^가-힣a-z0-9\-]/gi, "")
    .replace(/\-+/g, "-")
    .toLowerCase()
    .slice(0, 96);

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
              name: "displaySize",
              type: "string",
              title: "이미지 표시 크기",
              initialValue: "full",
              options: {
                layout: "radio",
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Full", value: "full" },
                  { title: "직접 입력", value: "custom" },
                ],
              },
            },
            {
              name: "customWidth",
              type: "number",
              title: "직접 width(px)",
              description: "이미지 표시 크기에서 직접 입력을 선택했을 때 사용합니다.",
              validation: (Rule) => Rule.min(120).max(1600),
            },
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
      options: {
        source: "title",
        maxLength: 96,
        slugify,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2024-01-01" });
          const id = document?._id?.replace(/^drafts\./, "");

          const existing = await client.fetch(
            `count(*[_type == "notice" && slug.current == $slug && !(_id in [$draftId, $publishedId])])`,
            {
              draftId: `drafts.${id}`,
              publishedId: id,
              slug,
            }
          );

          return existing === 0;
        },
      },
    }),
  ],
});
