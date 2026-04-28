import { useEffect } from "react";
import { set, useFormValue, useClient } from "sanity";

export default function AutoSlugInput(props) {
  const { value, onChange } = props;

  const title = useFormValue(["title"]);
  const client = useClient({ apiVersion: "2024-01-01" });

  const slugify = (input) => {
    return input
      ?.toString()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^가-힣a-z0-9\-]/gi, "")
      .replace(/\-+/g, "-")
      .toLowerCase()
      .slice(0, 96);
  };

  const generateUniqueSlug = async (baseSlug) => {
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await client.fetch(
        `count(*[_type == "notice" && slug.current == $slug])`,
        { slug }
      );

      if (existing === 0) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  };

  useEffect(() => {
    if (!title) return;

    const run = async () => {
      const baseSlug = slugify(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug);

      if (!value || value.current !== uniqueSlug) {
        onChange(set({ _type: "slug", current: uniqueSlug }));
      }
    };

    run();
  }, [title]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <input
        type="text"
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
    </div>
  );
}