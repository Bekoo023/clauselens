import { Fragment } from "react";

/**
 * Splits a line into words that rise in one after another.
 *
 * A server component: the spans and their delays are baked into the HTML, so
 * this costs no JavaScript on the client. `start` offsets the whole line when
 * several of them run in sequence.
 *
 * The separating space is a text node between the spans, not inside them. A
 * trailing space within an inline-block collapses, which would run the words
 * together and stop the line from wrapping where it should.
 */
export function WordReveal({
  text,
  className = "",
  start = 0,
  step = 55,
}: {
  text: string;
  className?: string;
  start?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className={`word-rise ${className}`}
            style={{ "--word-delay": `${start + i * step}ms` } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
