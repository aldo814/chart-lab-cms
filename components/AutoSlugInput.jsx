import { useEffect } from "react";
import { set, useFormValue } from "sanity";

export default function AutoSlugInput(props) {
  const { value, onChange } = props;

  const title = useFormValue(["title"]);

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

  useEffect(() => {
    if (!title) return;

    const newSlug = slugify(title);

    if (!value || value.current !== newSlug) {
      onChange(set({ _type: "slug", current: newSlug }));
    }
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