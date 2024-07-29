import { ChevronDown } from 'lucide-react';

export default function Option() {
  return (
    <article className="border-secondary grid grid-cols-[1fr_auto] gap-4 border p-4">
      <section className="col-span-1 flex flex-col gap-4">
        <p>
          What are the economic incentives for participation in DAOs, and how do they affect member
          engagement?
        </p>
        <p>
          <span>Creator: </span>
          Friedrich Wagner
        </p>
        <p>
          <span>Affiliation: </span>
          Affiliation 1
        </p>
        <span className="flex items-center gap-2">
          <img src="/icons/plurality-score.svg" width={24} height={24} />
          <p>200</p>
        </span>
      </section>
      <section className="col-start-2 col-end-3 flex flex-col justify-between">
        <section className="flex gap-1">
          <button>-</button>
          <p>999</p>
          <button>+</button>
        </section>
        <ChevronDown className="self-end" />
      </section>
      <section className="col-span-2">
        <p>
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
        </p>
      </section>
    </article>
  );
}
