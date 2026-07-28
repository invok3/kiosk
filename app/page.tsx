import Image from "next/image";
import Link from "next/link";


const basePath = process.env.NODE_ENV === 'production' ? '/coffee_end_prototype' : '';

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="w-full landscape:w-[50vh] h-screen overflow-hidden bg-cream-100 p-4 grid grid-rows-[1fr_auto_auto_auto_1fr_auto_3fr]">

        {/* 1st Row: 10% of remaining free space (1fr) */}
        <div />

        {/* 2nd Row: Logo / Image */}
        <div className="px-4 flex justify-center items-center">
          <div className="relative w-full aspect-square max-h-[50vh] max-w-[50vh] flex items-center justify-center">
            <Image
              // src={`${basePath}/coffee.png`}
              src="coffee.png"
              alt="كويك ستوب - Quick Stop"
              sizes="512"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* 3rd Row: Title */}
        <h1 className="text-3xl font-extrabold text-coffee-900 text-center mt-4">
          كويك ستوب
        </h1>

        {/* 4th Row: Subtitle */}
        <p className="text-coffee-500 text-center mt-2 text-base">
          اطلب مسبقاً. استلم. انطلق.
        </p>

        {/* 5th Row: 30% of remaining free space (3fr = 3x larger ratio) */}
        <div />

        {/* 6th Row: Start Button Container */}
        <div className="w-full flex justify-center">
          <Link
            href="/menu"
            prefetch={false}
            className="w-full max-w-[50vh] py-4 bg-coffee-800 text-cream-100 text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-transform text-center block cursor-pointer">
            أطلب الان
          </Link>
        </div>

        {/* 7th Row: 10% of remaining free space (1fr) */}
        <div />

      </div>
    </main>
  );
}
