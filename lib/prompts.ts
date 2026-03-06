const prompts: string[] = [
  "What's on your mind right now?",
  "Write the thing you can't say out loud.",
  "What does today feel like?",
  "Describe a moment you keep returning to.",
  "What are you carrying that no one knows about?",
  "If you could send a message to someone without them knowing who wrote it, what would you say?",
  "What's the smallest thing that made you feel something today?",
  "Write about something you've never told anyone.",
  "What would you want a stranger to understand about your life?",
  "Describe the last time you felt truly at peace.",
  "What are you afraid of right now?",
  "Write about a goodbye that still lives in you.",
  "What does home feel like?",
  "Describe a sound that makes you feel safe.",
  "What are you holding onto that you should let go of?",
];

export function getRandomPrompt(): string {
  return prompts[Math.floor(Math.random() * prompts.length)];
}
