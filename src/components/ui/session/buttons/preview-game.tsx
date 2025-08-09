'use client';

import { ButtonLink } from '@/components/ui/session/lobby/buttons';
import { MagnifyingGlassIcon} from '@heroicons/react/16/solid';

export default function PreviewGameLink() {
  return (
    <ButtonLink
      icon={MagnifyingGlassIcon}
      tooltip="Preview questions"
      onClick={() => {}}
    >
      Preview
    </ButtonLink>
  );
}
