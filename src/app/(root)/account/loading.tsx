import Loader from "@/components/loader";

export default function Loading() {
  return (
    <div className="pointer-events-none fixed inset-0 z-100">
      <div className="absolute left-0 right-0 top-0 flex h-full items-center justify-center md:left-64">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-black/5 bg-white/60 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-black/40">
          <Loader />
        </div>
      </div>
    </div>
  );
}
