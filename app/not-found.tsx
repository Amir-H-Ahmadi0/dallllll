import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#071513] text-[#F0EDE5] p-6 text-center" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-[#142623] border border-[#C48B4C]/40 flex items-center justify-center text-[#C48B4C] text-2xl font-black mb-4">
        ۴۰۴
      </div>
      <h1 className="text-2xl font-black mb-2">صفحه مورد نظر یافت نشد</h1>
      <p className="text-xs text-[#A2B2AC] mb-6 max-w-sm">
        صفحه‌ای که به دنبال آن بودید پیدا نشد یا تغییر یافته است.
      </p>
      <Link
        href="/"
        className="py-2.5 px-6 rounded-xl bg-[#C48B4C] hover:bg-[#DBA366] text-[#1B1107] font-bold text-xs transition-all shadow-md"
      >
        بازگشت به منوی کافه دال
      </Link>
    </div>
  );
}
