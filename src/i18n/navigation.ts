// src/i18n/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { routing, type Pathnames, type Locale } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type { Pathnames, Locale };
