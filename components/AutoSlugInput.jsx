import { useEffect } from "react";
import { set, useFormValue, useClient } from "sanity";

export default function AutoSlugInput(props) {
  const { value, onChange, readOnly } = props;

  const title = useFormValue(["title"]);
  const docId = useFormValue(["_id"]);
  const client = useClient({ apiVersion: "2024-01-01" });

  const slugify = (input) =>
    input
      ?.toString()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^가-힣a-z0-9\-]/gi, "")
      .replace(/\-+/g, "-")
      .toLowerCase()
      .slice(0, 96);

  const generateUniqueSlug = async (baseSlug) => {
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await client.fetch(
        `count(*[_type == "notice" && slug.current == $slug && _id != $id])`,
        { slug, id: docId }
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
    if (!docId?.startsWith("drafts.")) return;

    const run = async () => {
      const baseSlug = slugify(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug);

      if (!value?.current) {
        onChange(set({ _type: "slug", current: uniqueSlug }));
      }
    };

    run();
  }, [title]);

  return (
    <input
      value={value?.current || ""}
      readOnly
      style={{ width: "100%", padding: "10px" }}
    />
  );
}