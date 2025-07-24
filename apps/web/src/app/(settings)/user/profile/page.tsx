import { PenSquare, Upload } from 'lucide-react';

import { Button, Separator } from '@nx-ddd/ui';

export default function Page() {
  return (
    <div className="flex flex-1 justify-center gap-4 px-4 py-8">
      <div className="flex max-w-3xl flex-1 flex-col gap-2">
        <h4 className="text-lg font-semibold text-black dark:text-white">
          My Profile
        </h4>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-col justify-center sm:flex-1">
            <p className="text-md font-medium text-black dark:text-white">
              User name
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              This is a display name and is not used for authentication
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-1 sm:items-end">
            <div className="flex items-center gap-2">
              <p className="text-md text-black dark:text-white">
                Marcos Vinícius
              </p>
              <Button variant="ghost" size="icon">
                <PenSquare className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-col justify-center sm:flex-1">
            <p className="text-md font-medium text-black dark:text-white">
              Profile image
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Upload your own image as your avatar
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-1 sm:items-end">
            <div className="flex flex-col">
              <div className="relative cursor-pointer">
                <span
                  className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border"
                  style={{
                    height: '60px',
                    width: '60px',
                  }}
                >
                  <img
                    className="aspect-square h-full w-full"
                    src="https://lh3.googleusercontent.com/a/ACg8ocKSDijxSPWpwqRlVu7acevokk2H_dax1MQOR1pXtmjahXDgyXOl7A=s96-c"
                    alt="Profile image"
                  />
                </span>
                <div className="absolute left-0 top-0 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gray-500/20 opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100">
                  <div className="bg-background rounded-full p-2">
                    <Upload className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
