function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 py-8 bg-black">
      <div className="px-[10%] flex flex-col items-center gap-2 text-xs text-zinc-500">
        <a
          href="https://beian.miit.gov.cn/"
          rel="noreferrer"
          target="_blank"
          className="hover:text-zinc-300 transition-colors"
        >
          浙ICP备2026038123号
        </a>
      </div>
    </footer>
  );
}

export default Footer;
