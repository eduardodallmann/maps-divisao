'use client';

import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

export function ReactPopover({
  children,
  content,
  trigger = 'click',
}: PropsWithChildren<{
  content: React.ReactNode;
  trigger?: 'click' | 'hover';
}>) {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = () => {
    if (trigger === 'hover') {
      setShow(true);
    }
  };

  const handleMouseLeft = () => {
    if (trigger === 'hover') {
      setShow(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return undefined;
  }, [show, wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeft}
      className="w-fit h-fit relative flex justify-center"
    >
      <div onClick={() => setShow(!show)}>{children}</div>
      <div
        hidden={!show}
        className="min-w-fit w-[200px] h-fit absolute right-[100%] z-50 transition-all"
      >
        <div className="rounded bg-white p-3 shadow-[10px_30px_150px_rgba(46,38,92,0.25)] mb-[10px]">
          {content}
        </div>
      </div>
    </div>
  );
}
