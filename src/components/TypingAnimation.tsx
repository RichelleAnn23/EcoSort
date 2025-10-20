import { useEffect, useState } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  // New props for multi-color support
  colorSegments?: Array<{
    text: string;
    color?: string;
    className?: string;
  }>;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  className = "",
  style = {},
  colorSegments
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use colorSegments if provided, otherwise use plain text
  const fullText = colorSegments
    ? colorSegments.map(seg => seg.text).join('')
    : text;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText, speed]);

  // Render with color segments if provided
  if (colorSegments) {
    let charCount = 0;
    return (
      <span className={className} style={style}>
        {colorSegments.map((segment, idx) => {
          const segmentStart = charCount;
          const segmentEnd = charCount + segment.text.length;
          charCount = segmentEnd;

          // Calculate how much of this segment to show
          const visibleLength = Math.max(0, Math.min(
            displayedText.length - segmentStart,
            segment.text.length
          ));

          const visibleText = segment.text.slice(0, visibleLength);

          return (
            <span
              key={idx}
              style={segment.color ? { color: segment.color } : undefined}
              className={segment.className}
            >
              {visibleText}
            </span>
          );
        })}
        {currentIndex < fullText.length && (
          <span className="animate-pulse">|</span>
        )}
      </span>
    );
  }

  // Original single-color rendering
  return (
    <span className={className} style={style}>
      {displayedText}
      {currentIndex < fullText.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypingAnimation;
