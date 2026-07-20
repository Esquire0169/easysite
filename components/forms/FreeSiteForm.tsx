"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormState = {
  project: string;
  description: string;
  links: string;
  contact: string;
  why: string;
};

const initial: FormState = {
  project: "",
  description: "",
  links: "",
  contact: "",
  why: "",
};

export function FreeSiteForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<FormState> = {};
    if (!values.project.trim()) nextErrors.project = "Укажите название проекта";
    if (!values.description.trim()) {
      nextErrors.description = "Опишите проект";
    }
    if (!values.contact.trim()) nextErrors.contact = "Укажите контакт";
    if (!values.why.trim()) {
      nextErrors.why = "Расскажите, почему проект важен";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Ready for future API route: POST /api/free-sites with `values`
    console.info("[EasySite free-site draft]", values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-vanilla/20 bg-vanilla/10 p-6 sm:p-8">
        <p className="font-display text-2xl font-semibold text-vanilla">
          Заявка на бесплатный сайт отправлена
        </p>
        <p className="mt-3 text-sm leading-relaxed text-vanilla/75">
          Мы отбираем 2–3 проекта в месяц. Если заявка пройдёт отбор — сайт
          сделаем по тем же правилам EasySite: 24 часа, без правок, наш хостинг
          и префикс easysite.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setValues(initial);
          }}
        >
          Подать ещё одну
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Input
        label="Название проекта"
        name="project"
        value={values.project}
        onChange={(e) => update("project", e.target.value)}
        error={errors.project}
        required
      />
      <Textarea
        label="Описание"
        name="description"
        value={values.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
        placeholder="Чем занимается проект и какой сайт нужен"
        required
      />
      <Input
        label="Ссылки"
        name="links"
        value={values.links}
        onChange={(e) => update("links", e.target.value)}
        placeholder="Сайт, соцсети, материалы"
      />
      <Input
        label="Контакт"
        name="contact"
        value={values.contact}
        onChange={(e) => update("contact", e.target.value)}
        error={errors.contact}
        placeholder="Телефон, Telegram или email"
        required
      />
      <Textarea
        label="Почему проект важен"
        name="why"
        value={values.why}
        onChange={(e) => update("why", e.target.value)}
        error={errors.why}
        placeholder="Социальная значимость, масштаб, уникальность"
        required
      />
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Подать заявку
      </Button>
    </form>
  );
}
