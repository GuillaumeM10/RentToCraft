"use client";
import { useEffect, useRef, useState } from "react";
import AnimatedNumber from "../AnimatedNumber";

interface NumbersProps {
  title?: string;
  data?: {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
  }[];
}

const Numbers = ({ title, data }: NumbersProps) => {
  return (
    <div className="numbers">
      {title && (
        <h2 className="text-center mb-8 text-2xl font-bold">{title}</h2>
      )}
      <div className="md:flex justify-between gap-8">
        {data?.map((item, index) => (
          <div
            key={index}
            className="block-number tac text-center mb-6 md:mb-0"
          >
            <AnimatedNumber
              value={item.value}
              prefix={item.prefix}
              suffix={item.suffix}
            />
            <p className="title">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Numbers;
