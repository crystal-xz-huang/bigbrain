'use client';

import { Button } from '@/components/ui/button';
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import Form from 'next/form';

export default function Account() {
  return (
    <Form>
      <Fieldset className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Legend className="!text-base/7">Account Settings</Legend>
          <Text>Update your account information below.</Text>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            {/* Email */}
            <Field className="col-span-full">
              <Label htmlFor="email">Email address</Label>
              <Description className="mt-2 !text-xs/5">
                Change the email address you want associated with your account.
              </Description>
              <form className="mt-5 sm:flex sm:items-center">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className='w-full sm:max-w-xs'
                />
                <Button type="submit" color="indigo" className="inline-flex w-full sm:mt-0 sm:ml-3 sm:w-auto">
                  Change Email
                </Button>
              </form>
            </Field>

            {/* Password */}
            <form className="grid grid-cols-subgrid sm:col-span-3">
              <Field>
                <Label htmlFor="">Password</Label>
              </Field>
              <Button type="submit" color="indigo" className="mt-3 sm:col-span-2 sm:mt-0">
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </Fieldset>
    </Form>
  );
}
