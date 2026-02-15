/**
 * FreeLang v2 Phase 5 - Minimal AST
 *
 * .free 파일 형식만 지원하는 축소된 AST
 *
 * 예시:
 *   @minimal
 *   fn sum
 *   input: array<number>
 *   output: number
 *   intent: "배열 합산"
 */

/**
 * Minimal Function AST
 *
 * .free 파일의 함수 선언을 나타내는 최소 구조
 */
export interface MinimalFunctionAST {
  // 선언 타입
  decorator?: 'minimal'; // @minimal 있으면 'minimal'

  // 함수 정보
  fnName: string;        // 함수명
  inputType: string;     // 입력 타입 (예: "array<number>")
  outputType: string;    // 출력 타입 (예: "number")

  // 의도 및 설명
  intent?: string;       // 의도 (예: "배열 합산")
  reason?: string;       // 추가 설명 (선택사항)

  // 원본 정보
  source?: {
    line: number;
    column: number;
  };
}

/**
 * Parse error
 */
export class ParseError extends Error {
  constructor(
    public line: number,
    public column: number,
    message: string
  ) {
    super(`[${line}:${column}] ${message}`);
    this.name = 'ParseError';
  }
}
