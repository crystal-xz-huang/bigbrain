import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  Fieldset,
  Legend
} from '@/components/ui/fieldset';
import { Text } from '@/components/ui/text';
import { PageHeading } from '@/components/admin/layout';
import AccountForm from '@/components/admin/settings/account';
import ProfileForm from '@/components/admin/settings/profile';
import type { Metadata } from 'next';
import Form from 'next/form';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Settings() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <PageHeading heading="Settings"/>

      {/* Settings forms */}
      <div className="divide-y divide-white/5">
        {/* Profile Form */}
        <ProfileForm />

        {/* Account Form */}
        <AccountForm />

        {/* Delete Account Form */}
        <Form>
          <Fieldset className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <Legend className="!text-base/7 ">Delete account</Legend>
              <Text>
                No longer want to use our service? You can delete your account
                here. This action is not reversible. All information related to
                this account will be deleted permanently.
              </Text>
            </div>
            <div className="flex items-start md:col-span-2">
              <Button type="submit" color="red">
                Yes, delete my account
              </Button>
            </div>
          </Fieldset>
        </Form>
      </div>
    </>
  );
}
