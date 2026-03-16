"use client";

import React from 'react';
import { useParams } from "next/navigation";
import InterestCalculatorCourse from './interestCalculatorCourse';

export default function DynamicInterestCalculatorStep() {
  const params = useParams();
  const currentStep = params.step ? parseInt(params.step as string, 10) : 1;
  return <InterestCalculatorCourse step={currentStep} />;
}