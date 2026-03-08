import Link from "next/link";

export function CollageTitleBlock() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="font-handwritten text-[49px] leading-[45px] md:text-[100px] md:leading-[93.846px] text-black text-center md:w-[658px]">
        <span className="md:hidden">
          excerpts
          <br />
          from
          <br />
          a journal
        </span>
        <span className="hidden md:inline">
          excerpts from
          <br />
          a journal
        </span>
      </h1>

      {/* Outer pill */}
      <Link
        href="/write"
        className="mt-10 inline-flex items-start rounded-[70px] md:rounded-[145px] bg-[rgba(216,216,216,0.82)] p-[6px] md:p-[12.437px] shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.1)] no-underline transition-transform duration-200 hover:scale-105 active:scale-100 relative"
      >
        {/* Inner dark pill */}
        <span
          className="relative inline-flex items-center justify-center rounded-[74px] md:rounded-[153px] px-[30px] pt-[20px] pb-[22px] md:px-[62px] md:py-[30px] text-[13px] md:text-[27px] font-bold md:font-normal leading-[16px] md:leading-[33px] text-white text-center overflow-clip"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 161 58' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.2'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(10.073 3.1417 -0.50738 3.6286 45.307 -6.0417)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(90deg, #272727 0%, #272727 100%)",
            boxShadow:
              "0px 2.767px 2.214px 0px rgba(0,0,0,0.12), 0px 3px 3px 0px rgba(0,0,0,0.14), 0px 100px 80px 0px rgba(0,0,0,0.15), 0px 41.778px 33.422px 0px rgba(0,0,0,0.15), 0px 22.336px 17.869px 0px rgba(0,0,0,0.14), 0px 12.522px 10.017px 0px rgba(0,0,0,0.14), 0px 6.65px 5.32px 0px rgba(0,0,0,0.13), 0px 2.767px 2.214px 0px rgba(0,0,0,0.12)",
          }}
        >
          write something
          {/* Bevel highlight */}
          <span className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.3),inset_0px_-3px_0px_0px_#080808] md:shadow-[inset_0px_2.073px_0px_0px_rgba(255,255,255,0.3),inset_0px_-6.218px_0px_0px_#080808]" />
        </span>
        {/* Outer pill inner shadow */}
        <span className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.08)]" />
      </Link>
    </div>
  );
}
