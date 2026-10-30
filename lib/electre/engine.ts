import type { ElectreInput } from "./types";

// 1. Mengambil data nilai seluruh mahasiswa
export function getDecisionMatrix(input: ElectreInput): number[][] {
  return input.applicants.map((applicant) => applicant.values);
}

// 2. Menghitung normalisasi matriks keputusan
export function normalizeMatrix(matrix: number[][]): number[][] {
  const columnCount = matrix[0].length;

  // Menghitung akar jumlah kuadrat setiap kolom
  const denominators = Array.from({ length: columnCount }, (_, j) => {
    const sumOfSquares = matrix.reduce(
      (sum, row) => sum + row[j] ** 2,
      0
    );

    return Math.sqrt(sumOfSquares);
  });

  // Membagi setiap nilai dengan penyebut kolomnya
  return matrix.map((row) =>
    row.map((value, j) => {
      return denominators[j] === 0 ? 0 : value / denominators[j];
    })
  );
}

// 3. Menghitung matriks ternormalisasi terbobot
export function calculateWeightedMatrix(
  normalizedMatrix: number[][],
  weights: number[]
): number[][] {
  return normalizedMatrix.map((row) =>
    row.map((value, j) => value * weights[j])
  );
}