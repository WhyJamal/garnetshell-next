import Loader from "@/components/loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-black/5 bg-white/60 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/40">
        <Loader />
      </div>
    </div>
  );
}