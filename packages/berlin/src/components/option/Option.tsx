import { ChevronDown } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import Link from '../link';
import { Body } from '../typography/Body.styled';

export default function Option() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (expandedRef.current) {
      setExpandedHeight(isExpanded ? expandedRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const handleChevronClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className="border-secondary grid w-full grid-cols-[1fr_auto] gap-4 border p-4">
      <section className="col-span-1 flex flex-col gap-4">
        <Body>
          What are the economic incentives for participation in DAOs, and how do they affect member
          engagement?
        </Body>
        <Body>
          <span>Creator: </span>
          Friedrich Wagner
        </Body>
        <Body>
          <span>Affiliation: </span>
          Affiliation 1
        </Body>
        <span className="flex items-center gap-2">
          <img src="/icons/plurality-score.svg" width={24} height={24} />
          <Body>200</Body>
        </span>
      </section>
      <section className="col-start-2 col-end-3 flex flex-col justify-between">
        <section className="flex gap-1">
          <button>-</button>
          <Body>999</Body>
          <button>+</button>
        </section>
        <section className="w-full self-center">
          <ChevronDown
            onClick={handleChevronClick}
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </section>
      </section>
      <section
        ref={expandedRef}
        style={{ maxHeight: expandedHeight }}
        className="transition-max-height col-span-2 overflow-hidden duration-300"
      >
        <Markdown
          components={{
            a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
            p: ({ node, ...props }) => <Body>{props.children}</Body>,
          }}
        >
          The emergence of Decentralized Autonomous Organizations (DAOs) presents unique challenges
          in terms of regulatory compliance and legal recognition. This research explores the
          strategies employed by DAOs to navigate the complex legal landscape across various
          jurisdictions. By conducting a comparative analysis of regulatory frameworks in regions
          such as the United States, European Union, and Asia, the study identifies key legal
          obstacles and compliance requirements faced by DAOs. It also examines case studies of DAOs
          that have successfully achieved legal recognition and compliance. The findings aim to
          provide a roadmap for DAOs seeking to operate within legal boundaries while maintaining
          their decentralized ethos, offering insights into potential regulatory reforms that could
          facilitate the growth of DAOs.
        </Markdown>
      </section>
    </article>
  );
}
