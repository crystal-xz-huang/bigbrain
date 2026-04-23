import { MIN_PASSWORD_LENGTH } from '@/lib/definitions/constants';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import styles from '@/styles/signup.module.css';

const PASSWORD_REQUIREMENTS = {
  minLength: {
    test: (password: string) => password.length >= MIN_PASSWORD_LENGTH,
    label: `${MIN_PASSWORD_LENGTH}+ characters`,
  },
  lowercase: {
    test: (password: string) => /[a-z]/.test(password),
    label: '1 lowercase letter',
  },
  uppercase: {
    test: (password: string) => /[A-Z]/.test(password),
    label: '1 uppercase letter',
  },
  number: {
    test: (password: string) => /[0-9]/.test(password),
    label: '1 number',
  },
  specialChar: {
    test: (password: string) => /[!@#$%^&*()\-_=+{};:,<.>]/.test(password),
    label: 'At least one special character',
  },
}

export default function PasswordRequirementsPopup({
  show,
  password,
}: {
  show: boolean;
  password: string;
}) {
  return (
    <Headless.Transition show={show}>
      <div
        id="password-reqs"
        className={clsx([
          styles.TippyRoot,
          'transition ease-in-out duration-300',
          'data-closed:opacity-0',
        ])}
      >
        <div role="tooltip" className={styles.TippyBox}>
          <div className={styles.TippyContent}>
            <div className={styles.TooltipContent}>
              <span>Password strength:</span>
              <ul className={styles.TooltipList}>
                {Object.values(PASSWORD_REQUIREMENTS).map((req, idx) => (
                  <li
                    key={idx}
                    className={clsx(
                      styles.TooltipItem,
                      req.test(password) && styles.TooltipItemValid
                    )}
                  >
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.TippyArrow} />
        </div>
      </div>
    </Headless.Transition>
  );
}
