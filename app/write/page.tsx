import type { Metadata } from "next";
import { EntryForm } from "@/components/EntryForm";

export const metadata: Metadata = {
  title: "Write — Excerpts from a Journal",
  description: "Leave your words here, anonymously.",
};

export default function WritePage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-lg font-light italic text-ink-faint">
          Write something. No one will know it was you.
        </h1>
      </div>
      <EntryForm />
    </div>
  );
}
