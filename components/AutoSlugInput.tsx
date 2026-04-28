import { useEffect, useState } from "react";
import { set, useFormValue, useClient } from "sanity";
import type { SlugInputProps } from "sanity";

export default function AutoSlugInput(props: SlugInputProps) {
  const { value, onChange, readOnly } = props;

  const [locked, setLocked] = useState(false);

  const title = useFormValue(["title"]) as string;
  const docId = useFormValue(["_id"]) as string;
  const client = useClient({ apiVersion: "2024-01-01" });

  const slugify = (input: string) =>
    input
      ?.toString()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^가-힣a-z0-9\-]/gi, "")
      .replace(/\-+/g, "-")
      .toLowerCase()
      .slice(0, 96);

  const generateUniqueSlug = async (baseSlug: string) => {
    let slug = baseSlug;
    let count = 1;

    const cleanId = docId?.replace("drafts.", "");

    while (true) {
      const existing = await client.fetch(
        `count(*[_type == "notice" && slug.current == $slug && _id != $id])`,
        { slug, id: cleanId }
      );

      if (existing === 0) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  };

  useEffect(() => {
    if (!title) return;
    if (readOnly) return;
    if (locked) return;
    if (!docId?.startsWith("drafts.")) return;

    const run = async () => {
      const baseSlug = slugify(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug);

      if (!value?.current) {
        onChange(set({ _type: "slug", current: uniqueSlug }));
        setLocked(true);
      }
    };

    run();
  }, [title, docId, value, readOnly, locked]);

  return (
    <input
      value={value?.current || ""}
      readOnly
      placeholder="자동 생성됩니다"
      style={{
        width: "100%",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        background: "#f9f9f9",
      }}
    />
  );
}