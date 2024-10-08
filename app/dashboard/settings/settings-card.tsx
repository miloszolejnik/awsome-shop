'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Session } from 'next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SettingsSchema } from '@/app/types/settings-schema';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/auth/form-error';
import { FormSucces } from '@/components/auth/form-succes';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { settings } from '@/server/actions/settings';
import { UploadButton } from '@/app/api/uploadthing/upload';
type SettingsFormType = {
  session: Session;
};

export default function SettingsCard(session: SettingsFormType) {
  const form = useForm<zod.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.session.user?.name || undefined,
      image: session.session.user?.image || undefined,
      email: session.session.user?.email || undefined,
      TwoFactorEnabled: session.session.user?.twoFactorEnabled || undefined,
      password: undefined,
      newPassword: undefined,
    },
  });

  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        setSuccess(data.data.success);
      }
      if (data?.data?.error) {
        setError(data.data.error);
      }
    },
    onError: (error) => {
      setError('Somethinkg went wrong');
    },
  });

  const onSubmit = (values: zod.infer<typeof SettingsSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    execute(values);
  };

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [avatarUploading, setAvatarUploading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === 'executing'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@ex.com"
                      disabled={status === 'executing'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues('image') && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues('image') && (
                      <Image
                        className="rounded-full"
                        src={form.getValues('image')!}
                        alt="Avatar"
                        width={42}
                        height={42}
                      />
                    )}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError('image', {
                          message: error.message,
                          type: 'validate',
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue('image', res[0].url);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar</div>;
                          return <div>Uploading...</div>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      type="hidden"
                      placeholder="User Image"
                      disabled={status === 'executing'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      disabled={
                        status === 'executing' ||
                        session.session.user.isOAuth === true
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      disabled={
                        status === 'executing' ||
                        session.session.user.isOAuth === true
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={
                        status === 'executing' ||
                        session.session.user.isOAuth === true
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSucces message={success} />
            <Button
              type="submit"
              disabled={status === 'executing' || avatarUploading}
            >
              Update Your Settings
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
