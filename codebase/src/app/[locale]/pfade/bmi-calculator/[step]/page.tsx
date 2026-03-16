"use client";

import React from 'react';
import { useParams } from "next/navigation";
import BmiCalculatorCourse from './bmiCalculatorCourse';

export default function DynamicBmiCalculatorStep() {
  const params = useParams();
  const currentStep = params.step ? parseInt(params.step as string, 10) : 1;
  return <BmiCalculatorCourse step={currentStep} />;
}