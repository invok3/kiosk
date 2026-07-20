// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <div 
        className="w-full landscape:w-[50vh] min-h-screen max-h-screen overflow-hidden bg-cream-100 p-6 grid grid-rows-[1fr_auto_auto_2fr_auto_1fr]"
      >
        {/* 1st Row: Top Spacer */}
        <div />

        {/* 2nd Row: Dead File Illustration Row */}
        <div className="flex justify-center items-center py-4">
          <div className="relative w-40 h-48 bg-cream-200 rounded-lg border-4 border-coffee-800 shadow-xl flex flex-col items-center justify-center">
            {/* The 'Dead' Face X_X */}
            <div className="text-coffee-800 text-4xl font-mono mt-8">
              404
            </div>
          </div>
        </div>


        {/* 4th Row: Subtitle */}
        <p className="text-coffee-500 text-center mt-3 text-lg px-4">
          عذراً، الصفحة غير موجودة.
        </p>

        {/* 5th Row: Middle Spacer */}
        <div />

        {/* 6th Row: Home Navigation Link */}
        <div className="w-full flex justify-center px-4">
          <Link 
            href="/"
            className="w-full max-w-[50vh] py-4 bg-coffee-800 text-cream-100 text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-transform text-center block cursor-pointer"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>

        {/* 7th Row: Bottom Spacer */}
        <div />

      </div>
    </main>
  );
}