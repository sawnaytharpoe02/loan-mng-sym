import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
}

export function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 50, 100, 200, 400],
}: PaginationProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        const delta = 1;
        const leftBoundary = 4;
        const rightBoundary = 4;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        pages.push(1);

        if (currentPage > leftBoundary + 1) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - rightBoundary) {
            pages.push("...");
        }

        if (end < totalPages) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    if (!mounted) return null;

    return (
        <div className="flex w-full items-center justify-between gap-4 py-4">
            {/* Items info */}
            <div className="text-muted-foreground text-sm">
                {totalItems > 0 ? (
                    <>
                        Showing{" "}
                        <span className="text-foreground font-semibold">{startItem}</span>{" "}
                        to <span className="text-foreground font-semibold">{endItem}</span>{" "}
                        of{" "}
                        <span className="text-foreground font-semibold">{totalItems}</span>{" "}
                        items
                    </>
                ) : (
                    "No items"
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Page size selector */}
                <div className="flex items-center gap-2">
                    <label htmlFor="page-size" className="text-muted-foreground text-sm">
                        Items per page:
                    </label>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9 rounded-full"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {pageNumbers.map((page, index) => (
                        <div key={`${page}-${index}`}>
                            {page === "..." ? (
                                <span className="text-muted-foreground px-2">•••</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className="h-9 min-w-9 rounded-full px-2"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 rounded-full"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
