"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormState = {
  company: string;
  activity: string;
  contact: string;
  links: string;
  style: string;
  blocks: string;
};

const initial: FormState = {
  company: "",
  activity: "",
  contact: "",
  links: "",
  style: "",
  blocks: "",
};

export function OrderForm() {
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
    if (!values.company.trim()) nextErrors.company = "Укажите название";
    if (!values.activity.trim()) nextErrors.activity = "Укажите род деятельности";
    if (!values.contact.trim()) nextErrors.contact = "Укажите контакт";
    if (!values.blocks.trim()) {
      nextErrors.blocks = "Опишите обязательные блоки сайта";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Ready for future API route: POST /api/order with `values`
    console.info("[EasySite order draft]", values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-ember/30 bg-ember/10 p-6 sm:p-8">
        <p className="font-display text-2xl font-semibold text-vanilla">
          Заявка принята
        </p>
        <p className="mt-3 text-sm leading-relaxed text-vanilla/75">
          После подтверждения оплаты и передачи исходных данных сайт будет
          готов за 24 часа — без правок после сдачи, на нашем хостинге и с
          доменом easysite. Мы свяжемся с вами по указанному контакту.
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
          Отправить ещё одну
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Input
        label="Название компании"
        name="company"
        value={values.company}
        onChange={(e) => update("company", e.target.value)}
        error={errors.company}
        placeholder="Например, Пекарня Утро"
        required
      />
      <Input
        label="Род деятельности"
        name="activity"
        value={values.activity}
        onChange={(e) => update("activity", e.target.value)}
        error={errors.activity}
        placeholder="Чем занимаетесь"
        required
      />
      <Input
        label="Контактные данные"
        name="contact"
        value={values.contact}
        onChange={(e) => update("contact", e.target.value)}
        error={errors.contact}
        placeholder="Телефон, Telegram или email"
        required
      />
      <Input
        label="Ссылки"
        name="links"
        value={values.links}
        onChange={(e) => update("links", e.target.value)}
        placeholder="Сайт, соцсети, референсы — если есть"
      />
      <Textarea
        label="Пожелания по стилю"
        name="style"
        value={values.style}
        onChange={(e) => update("style", e.target.value)}
        placeholder="Настроение, цвета, примеры которые нравятся"
      />
      <Textarea
        label="Обязательные блоки"
        name="blocks"
        value={values.blocks}
        onChange={(e) => update("blocks", e.target.value)}
        error={errors.blocks}
        placeholder="Например: герой, услуги, цены, контакты — до 5–7 смысловых блоков"
        required
      />
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Отправить заявку
      </Button>
    </form>
  );
}
