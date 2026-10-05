import { useRef, useState, type ReactNode } from "react";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import * as Slider from "@radix-ui/react-slider";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";

type Option = { value: string; label: string };
export function BankSelect({
  value,
  onValueChange,
  options,
  id,
  label,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  id?: string;
  label?: string;
  className?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        id={id}
        aria-label={label}
        className={"ui-select " + className}
      >
        <Select.Value />
        <Select.Icon className="ui-select-chevron">
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className="ui-select-menu"
        >
          <Select.ScrollUpButton className="ui-select-scroll">
            <ChevronUp size={15} />
          </Select.ScrollUpButton>
          <Select.Viewport className="ui-select-options">
            {options.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className="ui-select-option"
              >
                <Select.ItemText>{o.label}</Select.ItemText>
                <Select.ItemIndicator className="ui-select-check">
                  <Check size={15} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="ui-select-scroll">
            <ChevronDown size={15} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
export function BankModal({
  open,
  onClose,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const previousFocus = useRef<HTMLElement | null>(null);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="ui-modal-overlay" />
        <Dialog.Content
          className={"bank-modal " + className}
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            previousFocus.current = document.activeElement as HTMLElement;
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            previousFocus.current?.focus();
          }}
        >
          <Dialog.Title className="ui-sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function BankAccordion({ items }: { items: string[][] }) {
  return (
    <Accordion.Root type="single" collapsible className="faq-list">
      {items.map(([question, answer], i) => (
        <Accordion.Item
          value={String(i)}
          key={question}
          className="ui-accordion-item"
        >
          <Accordion.Header className="ui-accordion-heading">
            <Accordion.Trigger className="ui-accordion-trigger">
              {question}
              <ChevronDown size={17} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="ui-accordion-content">
            <p>{answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
export function BankSlider({
  value,
  onValueChange,
  min,
  max,
  step,
  label,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
}) {
  return (
    <Slider.Root
      value={[Math.min(max, Math.max(min, value))]}
      onValueChange={(values) => onValueChange(values[0])}
      min={min}
      max={max}
      step={step}
      className="ui-slider"
    >
      <Slider.Track className="ui-slider-track">
        <Slider.Range className="ui-slider-range" />
      </Slider.Track>
      <Slider.Thumb aria-label={label} className="ui-slider-thumb" />
    </Slider.Root>
  );
}
export function BankDatePicker({
  value,
  onValueChange,
  label,
}: {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = new Date(value + "T12:00:00");
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="ui-date-trigger" aria-label={label}>
          <span>
            {new Intl.DateTimeFormat("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(selected)}
          </span>
          <CalendarDays size={17} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={7}
          collisionPadding={12}
          className="ui-calendar"
          aria-label="Calendario de desembolso"
        >
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected}
            locale={es}
            weekStartsOn={1}
            onSelect={(day) => {
              if (day) {
                const date = [
                  day.getFullYear(),
                  String(day.getMonth() + 1).padStart(2, "0"),
                  String(day.getDate()).padStart(2, "0"),
                ].join("-");
                onValueChange(date);
                setOpen(false);
              }
            }}
          />
          <Popover.Arrow className="ui-calendar-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
export function BankProgress({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className="ui-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span style={{ width: percent + "%" }} />
    </div>
  );
}
