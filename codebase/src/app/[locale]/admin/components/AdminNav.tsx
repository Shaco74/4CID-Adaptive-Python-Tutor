import { HStack, Button } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "User Data" },
    { href: "/admin/chat-viewer", label: "Chat Viewer" },
    { href: "/admin/user-metrics-v2", label: "Metrics" },
    { href: "/admin/evaluations", label: "Evaluationen" },
    { href: "/admin/routes", label: "Routes" },
    { href: "/admin/course-tags", label: "Course Tags" },
    { href: "/admin/course-review", label: "Drill Review" },
    { href: "/admin/drill-assignment", label: "Drill Assignment" },
  ];

  return (
    <HStack
      gap={2}
      mb={6}
      p={3}
      bg="gray.900"
      borderRadius="md"
      wrap="wrap"
      justify="center"
    >
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            size="sm"
            variant={pathname === item.href ? "solid" : "ghost"}
            colorScheme={pathname === item.href ? "blue" : "gray"}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </HStack>
  );
}
