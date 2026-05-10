import { readFile } from "node:fs/promises";
import path from "node:path";
import { Document } from "@langchain/core/documents";
import { parse } from "csv-parse/sync";
import { PDFParse } from "pdf-parse";

export async function loadDocument(filePath){
    const ext = path.extname(filePath).toLowerCase();

    if(ext === ".pdf"){
        const buffer = await readFile(filePath);
        const parser = new PDFParse({ data: buffer });
        try {
            const result = await parser.getText();
            return [
                new Document({
                    pageContent: result.text,
                    metadata: { source: filePath, type: "pdf" },
                }),
            ];
        } finally {
            await parser.destroy();
        }
    }

    if(ext === ".csv"){
        const csv = await readFile(filePath, "utf8");
        const records = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });

        return records.map((record, index) => new Document({
            pageContent: Object.entries(record)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n"),
            metadata: { source: filePath, type: "csv", row: index + 1 },
        }));
    }

    throw new Error("Unsupported file type. Please upload a PDF or CSV file.");
}
