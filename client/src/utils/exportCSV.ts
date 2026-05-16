export const exportCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;

  // Collect all possible headers from the dataset to handle missing keys
  const headersSet = new Set<string>();
  data.forEach((row) => Object.keys(row).forEach((k) => headersSet.add(k)));
  const headers = Array.from(headersSet);

  const escape = (val: any) => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    // Replace any double quotes with two double quotes per CSV standard
    str = str.replace(/"/g, '""');
    // Wrap the field in double quotes to preserve commas/newlines
    return `"${str}"`;
  };

  const rows = data
    .map((row) => headers.map((h) => escape(row[h])).join(","))
    .join("\n");

  const csv = `${headers.join(",")}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
