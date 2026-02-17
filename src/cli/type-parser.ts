/**
 * FreeLang Type Annotation Parser
 * Parse optional type annotations in function signatures
 */

/**
 * Type information for a function parameter
 */
export interface ParameterType {
  name: string;
  type: string;
}

/**
 * Function with type annotations
 */
export interface TypedFunction {
  type: 'FunctionDefinition';
  name: string;
  params: string[];
  paramTypes: Record<string, string>;  // param name -> type
  returnType?: string;                  // return type (optional)
  body: string;
}

/**
 * TypeParser: Extract and parse type annotations from function signatures
 * Syntax: fn name(param1: type1, param2: type2): returnType { body }
 */
export class TypeParser {
  /**
   * Parse type annotations from a single function signature
   * Handles both typed and untyped parameters
   */
  static parseTypeAnnotations(functionSignature: string): {
    paramTypes: Record<string, string>;
    returnType?: string;
    params: string[];
  } {
    const paramTypes: Record<string, string> = {};
    const params: string[] = [];
    let returnType: string | undefined;

    // Extract parameter list: fn name(PARAMS): RETURN
    const paramMatch = functionSignature.match(/\((.*?)\)(?:\s*:\s*(\w+|array<[^>]+>))?/);
    if (!paramMatch) {
      return { paramTypes, params, returnType };
    }

    const paramStr = paramMatch[1];
    returnType = paramMatch[2];

    // Parse individual parameters
    if (paramStr.trim().length > 0) {
      const paramParts = this.splitParameters(paramStr);

      for (const param of paramParts) {
        const param_trimmed = param.trim();
        if (!param_trimmed) continue;

        // Check if parameter has type annotation
        const typeMatch = param_trimmed.match(/^(\w+)\s*:\s*(.+)$/);
        if (typeMatch) {
          const name = typeMatch[1];
          const type = typeMatch[2].trim();
          paramTypes[name] = type;
          params.push(name);
        } else {
          // Parameter without type annotation
          params.push(param_trimmed);
        }
      }
    }

    return { paramTypes, params, returnType };
  }

  /**
   * Split parameters respecting nested angle brackets (for array<T>)
   */
  static splitParameters(paramStr: string): string[] {
    const params: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < paramStr.length; i++) {
      const ch = paramStr[i];

      if (ch === '<') {
        depth++;
        current += ch;
      } else if (ch === '>') {
        depth--;
        current += ch;
      } else if (ch === ',' && depth === 0) {
        params.push(current);
        current = '';
      } else {
        current += ch;
      }
    }

    if (current.length > 0) {
      params.push(current);
    }

    return params;
  }

  /**
   * Parse complete function with type annotations
   * Input: "fn add(a: number, b: number): number { return a + b }"
   * Output: TypedFunction with paramTypes and returnType extracted
   */
  static parseTypedFunction(source: string): TypedFunction | null {
    // Extract function signature and body
    const fnPattern = /fn\s+(\w+)\s*\((.*?)\)(?:\s*:\s*(\w+|array<[^>]+>))?\s*\{/;
    const match = source.match(fnPattern);

    if (!match) return null;

    const name = match[1];
    const paramsStr = match[2];
    const returnType = match[3];

    // Find the opening brace position
    const fnMatch = source.match(/fn\s+\w+\s*\(.*?\)(?:\s*:\s*(?:\w+|array<[^>]+>))?\s*\{/);
    if (!fnMatch) return null;

    const openBracePos = source.indexOf('{', fnMatch.index!);

    // Count braces to find matching closing brace
    let braceCount = 1;
    let pos = openBracePos + 1;

    while (pos < source.length && braceCount > 0) {
      if (source[pos] === '{') braceCount++;
      else if (source[pos] === '}') braceCount--;
      pos++;
    }

    // Extract body
    const bodyStr = source.substring(openBracePos + 1, pos - 1).trim();

    // Parse parameter types
    const { paramTypes, params } = this.parseTypeAnnotations(
      `(${paramsStr})${returnType ? ': ' + returnType : ''}`
    );

    return {
      type: 'FunctionDefinition',
      name,
      params,
      paramTypes,
      returnType,
      body: bodyStr
    };
  }

  /**
   * Parse multiple typed functions from source code
   */
  static parseTypedProgram(source: string): TypedFunction[] {
    const functions: TypedFunction[] = [];

    // Find all function definitions (typed and untyped)
    const fnPattern = /fn\s+(\w+)\s*\((.*?)\)(?:\s*:\s*(\w+|array<[^>]+>))?\s*\{/g;
    let match;

    while ((match = fnPattern.exec(source)) !== null) {
      const name = match[1];
      const paramsStr = match[2];
      const returnType = match[3];

      // Find the opening brace position
      const openBracePos = match.index + match[0].length - 1;

      // Count braces to find matching closing brace
      let braceCount = 1;
      let pos = openBracePos + 1;

      while (pos < source.length && braceCount > 0) {
        if (source[pos] === '{') braceCount++;
        else if (source[pos] === '}') braceCount--;
        pos++;
      }

      // Extract body
      const bodyStr = source.substring(openBracePos + 1, pos - 1);

      // Parse parameter types
      const { paramTypes, params } = this.parseTypeAnnotations(
        `(${paramsStr})${returnType ? ': ' + returnType : ''}`
      );

      functions.push({
        type: 'FunctionDefinition',
        name,
        params,
        paramTypes,
        returnType,
        body: bodyStr.trim()
      });
    }

    return functions;
  }

  /**
   * Extract all parameter types from a function
   */
  static getParameterTypes(functionSignature: string): ParameterType[] {
    const { paramTypes, params } = this.parseTypeAnnotations(functionSignature);

    return params.map(name => ({
      name,
      type: paramTypes[name] || 'any'
    }));
  }

  /**
   * Check if a type is valid
   * Valid types: number, string, boolean, array<T>, any
   */
  static isValidType(type: string): boolean {
    const validTypes = ['number', 'string', 'boolean', 'any'];

    // Check for basic types
    if (validTypes.includes(type)) return true;

    // Check for array<T>
    if (type.startsWith('array<') && type.endsWith('>')) {
      const innerType = type.substring(6, type.length - 1);
      return this.isValidType(innerType);
    }

    return false;
  }

  /**
   * Infer type of a literal value
   */
  static inferType(value: any): string {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'array<any>';
      // Assume homogeneous array
      const elementType = this.inferType(value[0]);
      return `array<${elementType}>`;
    }
    return 'any';
  }

  /**
   * Check if two types are compatible (for assignment/function calls)
   */
  static areTypesCompatible(targetType: string, sourceType: string): boolean {
    // Exact match
    if (targetType === sourceType) return true;

    // any is compatible with everything
    if (targetType === 'any' || sourceType === 'any') return true;

    // array<T> compatibility
    if (targetType.startsWith('array<') && sourceType.startsWith('array<')) {
      const targetInner = targetType.substring(6, targetType.length - 1);
      const sourceInner = sourceType.substring(6, sourceType.length - 1);
      return this.areTypesCompatible(targetInner, sourceInner);
    }

    return false;
  }
}
