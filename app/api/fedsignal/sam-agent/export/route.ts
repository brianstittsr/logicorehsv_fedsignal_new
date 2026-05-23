import { NextRequest, NextResponse } from "next/server";
// XLSX is optional - will use CSV fallback if not installed
let XLSX: any = null;
try {
  XLSX = require("xlsx");
} catch (e) {
  // XLSX not installed
}

export async function POST(req: NextRequest) {
  try {
    const { opportunities } = await req.json();

    if (!opportunities || !Array.isArray(opportunities)) {
      return NextResponse.json(
        { error: "Invalid opportunities data" },
        { status: 400 }
      );
    }

    // Transform data for export
    const exportData = opportunities.map((opp: any) => ({
      "Notice ID": opp.noticeId || "",
      "Title": opp.title || "",
      "Solicitation Number": opp.solicitationNumber || "",
      "Type": opp.type || "",
      "Agency": opp.organizationHierarchy?.replace(/\./g, " > ") || "",
      "Posted Date": opp.postedDate || "",
      "Response Deadline": opp.responseDeadLine || "",
      "NAICS Code": opp.naicsCode || "",
      "Classification Code": opp.classificationCode || "",
      "Set-Aside": opp.typeOfSetAside || "",
      "Status": opp.active === "true" ? "Active" : "Inactive",
      "Description": opp.description?.substring(0, 500) || "",
      "SAM.gov Link": opp.uiLink || "",
    }));

    // Use XLSX if available, otherwise fall back to CSV
    if (XLSX) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 20 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 30 },
        { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 15 },
        { wch: 10 }, { wch: 50 }, { wch: 40 },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Opportunities");
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="sam-opportunities-${new Date().toISOString().split("T")[0]}.xlsx"`,
        },
      });
    } else {
      // CSV fallback
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.map((row: any) =>
          headers.map((header) => {
            const value = row[header]?.toString().replace(/"/g, '""') || "";
            return `"${value}"`;
          }).join(",")
        ),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="sam-opportunities-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: error.message || "Export failed" },
      { status: 500 }
    );
  }
}
