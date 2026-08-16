"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/components/I18nProvider";

interface Contributor {
  login: string;
  name: string;
  html_url: string;
  avatar_url: string;
  contributions: number;
}

let cache: Contributor[] | null = null;
let promise: Promise<Contributor[]> | null = null;

function loadContributors(): Promise<Contributor[]> {
  if (cache) return Promise.resolve(cache);
  if (!promise) {
    promise = fetch("/contributors.json")
      .then((r) => {
        if (!r.ok) throw new Error(`contributors ${r.status}`);
        return r.json() as Promise<Contributor[]>;
      })
      .then((list) => {
        cache = list;
        return list;
      });
  }
  return promise;
}

export default function Contributors() {
  const { t } = useI18n();
  const [list, setList] = useState<Contributor[] | null>(null);

  useEffect(() => {
    let alive = true;
    loadContributors()
      .then((l) => {
        if (alive) setList(l);
      })
      .catch(() => {
        if (alive) setList([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!list || list.length === 0) return null;

  return (
    <section className="contributors" aria-label={t("contributors.title")}>
      <div className="section">{t("contributors.title")}</div>
      <p className="contributors__sub">{t("contributors.sub")}</p>
      <ul className="contributors__grid">
        {list.map((c) => (
          <li key={c.login}>
            <a
              className="contributors__card"
              href={c.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="contributors__avatar"
                src={c.avatar_url}
                alt=""
                width={56}
                height={56}
              />
              <span className="contributors__login">@{c.login}</span>
              <span className="contributors__count">
                {t("contributors.count", { n: c.contributions })}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}