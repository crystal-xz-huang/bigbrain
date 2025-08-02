'use client';

import { Button } from '@/components/ui/button';
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import Form from 'next/form';

export default function Integrations() {
  return (
    <Form>
      <Fieldset className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Legend className="!text-base/7">Integrations</Legend>
          <Text>Connect applications to your account.</Text>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            {/* Username */}
            <Field className="col-span-full">
              <Label htmlFor="name">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="janesmith"
              />
              <Description className="mt-2 !text-xs/5">
                Choose wisely! This will be your public identifier.
              </Description>
            </Field>

            {/* Name */}
            <Field className="col-span-full">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="janesmith"
              />
            </Field>

            {/* Bio */}
            <Field className="col-span-full">
              <Label htmlFor="bio">Bio</Label>
              <Textarea name="bio" maxLength={300} />
              <Description className="mt-2 !text-xs/5">
                Write a few sentences about yourself. Max 300 characters.
              </Description>
            </Field>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex">
            <Button type="submit" color="indigo">
              Save
            </Button>
          </div>
        </div>
      </Fieldset>
    </Form>
  );
}
