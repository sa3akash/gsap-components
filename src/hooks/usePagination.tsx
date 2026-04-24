type UsePaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay: number;
};

type UsePaginationReturn = {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
};

export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}: UsePaginationProps): UsePaginationReturn {
  const showLeftEllipsis = currentPage - 1 > paginationItemsToDisplay / 2;
  const showRightEllipsis = totalPages - currentPage + 1 > paginationItemsToDisplay / 2;

  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);
    const initialRange = {
      start: currentPage - halfDisplay,
      end: currentPage + halfDisplay,
    };

    const adjustedRange = {
      start: Math.max(1, initialRange.start),
      end: Math.min(totalPages, initialRange.end),
    };

    if (adjustedRange.start === 1) {
      adjustedRange.end = paginationItemsToDisplay;
    }
    if (adjustedRange.end === totalPages) {
      adjustedRange.start = totalPages - paginationItemsToDisplay + 1;
    }

    if (showLeftEllipsis) adjustedRange.start++;
    if (showRightEllipsis) adjustedRange.end--;

    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, i) => adjustedRange.start + i,
    );
  }

  const pages = calculatePaginationRange();

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}


/*
"use client"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { useState } from "react"
import { usePagination } from "@/components/hooks/use-pagination"

export function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 20
  const paginationItemsToDisplay = 7

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  })

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </Button>
        </PaginationItem>

        {showLeftEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showRightEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            →
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
*/