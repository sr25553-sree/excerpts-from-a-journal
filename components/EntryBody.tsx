interface EntryBodyProps {
  content: string;
}

export function EntryBody({ content }: EntryBodyProps) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="font-serif text-lg font-light leading-[1.9] text-ink md:text-xl md:leading-[1.9]">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={i > 0 ? "mt-6" : ""}>
          {paragraph.split("\n").map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
