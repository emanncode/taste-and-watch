export const AUTHOR = {
  name: "Ifeoluwa Olajubaje",
  handle: "@emanncode",
  role: "Full-Stack Developer",
  email: "olajubajeifeoluwa93@gmail.com",
  website: "https://emanncode.work",
  github: "https://github.com/emanncode",
  linkedin: "https://linkedin.com/in/emmanuel-olajubaje/",
  x: "https://x.com/emanncode",
  devpost: "https://devpost.com/Emann-Code-01",
} as const;

export const PROJECT = {
  name: "Taste & Watch",
  tagline: "What should I eat while watching this?",
  repository: "https://github.com/emanncode/taste-and-watch",
} as const;

export type SocialKey = "github" | "linkedin" | "x" | "devpost" | "website" | "email";
