import { UserRound } from "lucide-react";
import Link from "next/link";

export const SignInSection = ({ isLoading, Username }: { isLoading: boolean; Username: string }) => {
  return (
    <>
      <Link
        href={"/login"}
        className="border-2 w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center rounded-full border-[#010f1c1a]"
      >
        <UserRound size={26} />
      </Link>

      <Link href={"/login"} className="w-[80px] flex flex-col gap-1">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-10 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <>
            <div className="text-sm font-medium leading-tight">Hello, </div>
            <div className="text-sm font-semibold text-gray-700 leading-tight">
              {Username}
            </div>
          </>
        )}
      </Link>
    </>
  );
};
