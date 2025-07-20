'use client';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useMemo, useState, useEffect } from 'react';
/***************************************************************
                      Form Input
***************************************************************/
function InputGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="my-2 grid grid-cols-1">{children}</div>
    </div>
  );
}

function FormInput({
  invalid = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <InputGroup>
      <Input
        className="col-start-1 row-start-1 before:hidden"
        invalid={invalid}
        {...props}
      />
      {invalid && (
        <ExclamationCircleIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-rose-500 sm:size-4"
        />
      )}
    </InputGroup>
  );
}

export { FormInput as Input };

/***************************************************************
                      Password Input
***************************************************************/
export function InputPassword({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <Input
        type={showPassword ? 'text' : 'password'}
        className="col-start-1 row-start-1 before:hidden"
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeSlashIcon className="size-5 hover:opacity-100 opacity-50" />
        ) : (
          <EyeIcon className="size-5 hover:opacity-100 opacity-50" />
        )}
      </button>
    </InputGroup>
  );
}

/***************************************************************
                      Birthday Input
***************************************************************/
const MONTHS = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 },
];

const currentYear = new Date().getFullYear();

type BirthdayValue = {
  year: number;
  month: number;
  day: number;
};

export function InputBirthday({
  value,
  onChange,
  minYear = 1900,
  maxYear = currentYear,
  className,
}: {
  value?: Partial<BirthdayValue>;
  onChange?: (value: BirthdayValue) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}) {
  const initYear = value?.year ?? currentYear;
  const initMonth = value?.month ?? 1;
  const initDay = value?.day ?? 1;

  const [year, setYear] = useState<number>(initYear);
  const [month, setMonth] = useState<number>(initMonth);
  const [day, setDay] = useState<number>(initDay);

  // Ensure day is always valid when year/month change
  const daysInMonth = useMemo(
    () => new Date(year, month, 0).getDate(),
    [year, month]
  );

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
    // eslint-disable-next-line
  }, [year, month]);

  useEffect(() => {
    onChange?.({ year, month, day });
  }, [year, month, day, onChange]);

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newMonth = Number(e.target.value);
    setMonth(newMonth);
    setDay((d) => Math.min(d, new Date(year, newMonth, 0).getDate()));
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newYear = Number(e.target.value);
    setYear(newYear);
    setDay((d) => Math.min(d, new Date(newYear, month, 0).getDate()));
  }

  function handleDayChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDay(Number(e.target.value));
  }

  return (
    <div className={clsx('flex gap-3 mt-3', className)}>
      <Select
        id="birth_year"
        name="birth_year"
        value={year}
        onChange={handleYearChange}
      >
        {Array.from(
          { length: maxYear - minYear + 1 },
          (_, i) => maxYear - i
        ).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
      <Select
        id="birth_month"
        name="birth_month"
        value={month}
        onChange={handleMonthChange}
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>
      <Select
        id="birth_day"
        name="birth_day"
        value={day}
        onChange={handleDayChange}
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Select>
    </div>
  );
}
