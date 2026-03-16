"use client";

import React, { useMemo } from "react";
import { Box, Heading, Flex, Text } from "@chakra-ui/react";
import { getCoursesData, type Locale } from "@/courses/getCourseData";
import CourseCard from "./CourseCard";
import { useTranslations, useLocale } from "next-intl";

export default function CourseSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("home.courses");
  const coursesData = useMemo(() => getCoursesData(locale), [locale]);

  return (
    <Box maxW="container.lg" w="100%">
      <Heading as="h2" size="lg" mb={3} textAlign="left" color={{ base: "white", _light: "gray.900" }}>
        {t("title")}
      </Heading>

      <Text
        mb={6}
        color={{ base: "gray.300", _light: "gray.600" }}
        fontSize="sm"
        lineHeight="tall"
      >
        {t.rich("description", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </Text>

      <Flex direction="column" gap={4} width="100%">
        {coursesData.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </Flex>
    </Box>
  );
}
