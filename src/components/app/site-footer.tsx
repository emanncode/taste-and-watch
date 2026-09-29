"use client";

import { Globe, Mail, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AUTHOR, type SocialKey } from "@/lib/site";
import { GithubIcon, LinkedinIcon, XIcon } from "./social-icons";

type SocialItem = {
  key: SocialKey;
  label: string;
  href: string;
  Icon: React.ElementType;
};

const SOCIALS: SocialItem[] = [
  { key: "github", label: `GitHub (${AUTHOR.handle})`, href: AUTHOR.github, Icon: GithubIcon },
  { key: "linkedin", label: "LinkedIn", href: AUTHOR.linkedin, Icon: LinkedinIcon },
  { key: "x", label: "X / Twitter", href: AUTHOR.x, Icon: XIcon },
  { key: "devpost", label: "Devpost", href: AUTHOR.devpost, Icon: Trophy },
  { key: "website", label: "Portfolio", href: AUTHOR.website, Icon: Globe },
  { key: "email", label: "Email", href: `mailto:${AUTHOR.email}`, Icon: Mail },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-stone-800/50 bg-stone-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-[5%] py-7 sm:flex-row sm:justify-between sm:gap-8 sm:py-5">
        <p className="text-center text-xs text-stone-500 sm:text-left">
          <span>Built by </span>
          <a
            href={AUTHOR.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-stone-200 underline-offset-4 transition-colors hover:text-orange-400 hover:underline"
          >
            {AUTHOR.name}
          </a>
          <span>{" · "}</span>
          <a
            href={AUTHOR.website}
            target="_blank"
            rel="noreferrer"
            className="text-stone-400 underline-offset-4 transition-colors hover:text-orange-400 hover:underline"
          >
            {AUTHOR.website.replace(/^https?:\/\//, "")}
          </a>
        </p>

        <div className="flex items-center gap-3">
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <ul className="flex items-center gap-0.5">
            {SOCIALS.map(({ key, label, href, Icon }) => {
              const isMail = href.startsWith("mailto:");
              return (
                <li key={key}>
                  <Button
                    variant="ghost"
                    size="icon"
                    nativeButton={false}
                    render={
                      isMail ? (
                        <a href={href} />
                      ) : (
                        <a href={href} target="_blank" rel="noreferrer" />
                      )
                    }
                    aria-label={label}
                    title={label}
                    className="text-stone-500 transition-colors hover:bg-stone-800/60 hover:text-orange-400"
                  >
                    <Icon className="size-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
