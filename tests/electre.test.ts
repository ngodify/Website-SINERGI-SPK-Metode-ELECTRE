import { describe, it, expect } from "vitest";

import {
  getDecisionMatrix,
  normalizeMatrix,
  calculateWeightedMatrix,
} from "../lib/electre/engine";

import type { ElectreInput } from "../lib/electre/types";

// Data simulasi 5 mahasiswa
const input: ElectreInput = {
  criteria: [
    { code: "C1", name: "IPK", weight: 0.25, type: "BENEFIT" },
    { code: "C2", name: "Penghasilan Orang Tua", weight: 0.35, type: "COST" },
    { code: "C3", name: "Jumlah Tanggungan", weight: 0.25, type: "BENEFIT" },
    { code: "C4", name: "Prestasi", weight: 0.15, type: "BENEFIT" },
  ],

  applicants: [
    { id: "A1", name: "Andi", values: [3.85, 2500000, 4, 4] },
    { id: "A2", name: "Budi", values: [3.70, 4000000, 3, 5] },
    { id: "A3", name: "Citra", values: [3.90, 3000000, 5, 3] },
    { id: "A4", name: "Dinda", values: [3.50, 2000000, 2, 4] },
    { id: "A5", name: "Eko", values: [3.75, 5000000, 4, 2] },
  ],
};

describe("Pengujian dasar mesin ELECTRE", () => {
  it("harus menghasilkan matriks keputusan dengan benar", () => {
    const result = getDecisionMatrix(input);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([3.85, 2500000, 4, 4]);
  });

  it("harus menghasilkan matriks normalisasi", () => {
    const matrix = getDecisionMatrix(input);
    const result = normalizeMatrix(matrix);

    expect(result).toHaveLength(5);
    expect(result[0]).toHaveLength(4);

    // Nilai normalisasi A1 pada kriteria IPK
    expect(result[0][0]).toBeCloseTo(0.4600, 3);
  });

  it("harus menghasilkan matriks ternormalisasi terbobot", () => {
    const matrix = getDecisionMatrix(input);
    const normalized = normalizeMatrix(matrix);

    const weights = input.criteria.map((criterion) => criterion.weight);
    const result = calculateWeightedMatrix(normalized, weights);

    expect(result).toHaveLength(5);
    expect(result[0]).toHaveLength(4);

    // Nilai A1 pada C1 = normalisasi A1 C1 × bobot C1
    expect(result[0][0]).toBeCloseTo(0.1150, 3);
  });
});