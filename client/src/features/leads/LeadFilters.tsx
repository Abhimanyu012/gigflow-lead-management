import React from "react";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Qualified", label: "Qualified" },
  { value: "Lost", label: "Lost" },
];

const SOURCE_OPTIONS = [
  { value: "", label: "All Sources" },
  { value: "Website", label: "Website" },
  { value: "Instagram", label: "Instagram" },
  { value: "Referral", label: "Referral" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest first" },
  { value: "oldest", label: "Oldest first" },
];

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  searchTerm, onSearchChange,
  status, onStatusChange,
  source, onSourceChange,
  sort, onSortChange,
}) => {
  return (
    <div
      className="rounded-3xl border p-5 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap glass relative z-30"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Search */}
      <div className="flex-1 min-w-[180px]">
        <Input
          label="Search"
          placeholder="Name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
        />
      </div>

      {/* Source */}
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <Select
          label="Source"
          options={SOURCE_OPTIONS}
          value={source}
          onChange={onSourceChange}
        />
      </div>

      {/* Sort */}
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <Select
          label="Sort by"
          options={SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};
