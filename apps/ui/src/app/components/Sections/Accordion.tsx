"use client";
import { useState } from "react";

interface AccordionProps {
  title: string;
  description: string;
  items: {
    title: string;
    content: string;
  }[];
}

const Accordion = ({ title, description, items }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }

    if (newOpenItems.size > 1) {
      newOpenItems.forEach((itemIndex) => {
        if (itemIndex !== index) {
          newOpenItems.delete(itemIndex);
        }
      });
    }

    setOpenItems(newOpenItems);
  };

  return (
    <div className="accordion md:grid grid-cols-3 gap-40">
      <div>
        <h2 className="title">{title}</h2>
        {description && <p className="description">{description}</p>}
      </div>

      <div className="accordion-wrapper col-span-2">
        <div className="st-accordion">
          {items.map((element, index) => (
            <div key={index} className="st-accordion__item">
              <div className="accordion-title-wrapper">
                <a
                  href={`#content${index + 1}`}
                  className={`w-full items-center`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleItem(index);
                  }}
                >
                  <p className="accordion-title">
                    {element.title} <span className="chevron"></span>
                  </p>
                </a>
              </div>
              <div
                className={`st-accordion__content ${
                  openItems.has(index) ? "st-accordion__content--visible" : ""
                }`}
              >
                <div className="accordion-description">
                  <p className="description">{element.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
