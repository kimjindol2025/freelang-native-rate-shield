/**
 * Phase 10: Collections & Data Structures
 *
 * 컬렉션:
 * - HashMap / Dictionary
 * - Set
 * - Queue
 * - Stack
 * - PriorityQueue
 */

/**
 * 해시맵 (딕셔너리)
 */
export class HashMap<K, V> {
  private items: Map<string, [K, V]> = new Map();

  /**
   * 값 설정
   */
  set(key: K, value: V): void {
    const keyStr = this.getKeyString(key);
    this.items.set(keyStr, [key, value]);
  }

  /**
   * 값 조회
   */
  get(key: K): V | undefined {
    const keyStr = this.getKeyString(key);
    const entry = this.items.get(keyStr);
    return entry ? entry[1] : undefined;
  }

  /**
   * 키 존재 여부
   */
  has(key: K): boolean {
    const keyStr = this.getKeyString(key);
    return this.items.has(keyStr);
  }

  /**
   * 값 삭제
   */
  delete(key: K): boolean {
    const keyStr = this.getKeyString(key);
    return this.items.delete(keyStr);
  }

  /**
   * 모든 값 삭제
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * 크기
   */
  size(): number {
    return this.items.size;
  }

  /**
   * 모든 키
   */
  keys(): K[] {
    return Array.from(this.items.values()).map(([k]) => k);
  }

  /**
   * 모든 값
   */
  values(): V[] {
    return Array.from(this.items.values()).map(([, v]) => v);
  }

  /**
   * 모든 항목
   */
  entries(): Array<[K, V]> {
    return Array.from(this.items.values());
  }

  /**
   * 각 항목 처리
   */
  forEach(fn: (value: V, key: K) => void): void {
    for (const [key, value] of this.entries()) {
      fn(value, key);
    }
  }

  /**
   * 필터링
   */
  filter(predicate: (value: V, key: K) => boolean): HashMap<K, V> {
    const result = new HashMap<K, V>();
    for (const [key, value] of this.entries()) {
      if (predicate(value, key)) {
        result.set(key, value);
      }
    }
    return result;
  }

  /**
   * 맵핑
   */
  map<R>(fn: (value: V, key: K) => R): R[] {
    const result: R[] = [];
    for (const [key, value] of this.entries()) {
      result.push(fn(value, key));
    }
    return result;
  }

  /**
   * 키 문자열화
   */
  private getKeyString(key: K): string {
    if (typeof key === 'object') {
      return JSON.stringify(key);
    }
    return String(key);
  }
}

/**
 * 셋 (중복 없는 컬렉션)
 */
export class HashSet<T> {
  private items: Set<string> = new Set();
  private keyMap: Map<string, T> = new Map();

  /**
   * 요소 추가
   */
  add(item: T): void {
    const keyStr = this.getKeyString(item);
    this.items.add(keyStr);
    this.keyMap.set(keyStr, item);
  }

  /**
   * 요소 포함 여부
   */
  has(item: T): boolean {
    const keyStr = this.getKeyString(item);
    return this.items.has(keyStr);
  }

  /**
   * 요소 삭제
   */
  delete(item: T): boolean {
    const keyStr = this.getKeyString(item);
    this.keyMap.delete(keyStr);
    return this.items.delete(keyStr);
  }

  /**
   * 모든 요소 삭제
   */
  clear(): void {
    this.items.clear();
    this.keyMap.clear();
  }

  /**
   * 크기
   */
  size(): number {
    return this.items.size;
  }

  /**
   * 모든 요소
   */
  values(): T[] {
    return Array.from(this.keyMap.values());
  }

  /**
   * 합집합
   */
  union(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    for (const item of this.values()) {
      result.add(item);
    }
    for (const item of other.values()) {
      result.add(item);
    }
    return result;
  }

  /**
   * 교집합
   */
  intersection(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    for (const item of this.values()) {
      if (other.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  /**
   * 차집합
   */
  difference(other: HashSet<T>): HashSet<T> {
    const result = new HashSet<T>();
    for (const item of this.values()) {
      if (!other.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  /**
   * 키 문자열화
   */
  private getKeyString(item: T): string {
    if (typeof item === 'object') {
      return JSON.stringify(item);
    }
    return String(item);
  }
}

/**
 * 큐 (FIFO)
 */
export class Queue<T> {
  private items: T[] = [];

  /**
   * 요소 추가 (뒤)
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * 요소 제거 (앞)
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * 앞 요소 조회
   */
  peek(): T | undefined {
    return this.items[0];
  }

  /**
   * 크기
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 비었는지 확인
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 모든 요소 삭제
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 모든 요소
   */
  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * 스택 (LIFO)
 */
export class Stack<T> {
  private items: T[] = [];

  /**
   * 요소 추가 (위)
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * 요소 제거 (위)
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * 위 요소 조회
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * 크기
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 비었는지 확인
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 모든 요소 삭제
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 모든 요소
   */
  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * 우선순위 큐
 */
export class PriorityQueue<T> {
  private items: Array<{ value: T; priority: number }> = [];

  /**
   * 요소 추가 (우선순위 포함)
   */
  enqueue(value: T, priority: number = 0): void {
    const newItem = { value, priority };
    let inserted = false;

    for (let i = 0; i < this.items.length; i++) {
      if (priority < this.items[i].priority) {
        this.items.splice(i, 0, newItem);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.items.push(newItem);
    }
  }

  /**
   * 가장 높은 우선순위 요소 제거
   */
  dequeue(): T | undefined {
    return this.items.shift()?.value;
  }

  /**
   * 가장 높은 우선순위 요소 조회
   */
  peek(): T | undefined {
    return this.items[0]?.value;
  }

  /**
   * 크기
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 비었는지 확인
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 모든 요소 삭제
   */
  clear(): void {
    this.items = [];
  }
}

/**
 * 테스트
 */
export function testCollections(): void {
  console.log('=== Collections Tests ===\n');

  // 1. HashMap
  console.log('1️⃣ HashMap:');
  const map = new HashMap<string, number>();
  map.set('alice', 30);
  map.set('bob', 25);
  console.log(`   ✅ Get 'alice': ${map.get('alice')}`);
  console.log(`   ✅ Size: ${map.size()}`);
  console.log(`   ✅ Keys: ${map.keys().join(',')}`);

  // 2. HashSet
  console.log('\n2️⃣ HashSet:');
  const set = new HashSet<string>();
  set.add('a');
  set.add('b');
  set.add('a'); // duplicate
  console.log(`   ✅ Size: ${set.size()}`);
  console.log(`   ✅ Has 'b': ${set.has('b')}`);

  // 3. Queue
  console.log('\n3️⃣ Queue:');
  const queue = new Queue<number>();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  console.log(`   ✅ Dequeue: ${queue.dequeue()}`);
  console.log(`   ✅ Peek: ${queue.peek()}`);

  // 4. Stack
  console.log('\n4️⃣ Stack:');
  const stack = new Stack<string>();
  stack.push('a');
  stack.push('b');
  stack.push('c');
  console.log(`   ✅ Pop: ${stack.pop()}`);
  console.log(`   ✅ Peek: ${stack.peek()}`);

  // 5. PriorityQueue
  console.log('\n5️⃣ PriorityQueue:');
  const pq = new PriorityQueue<string>();
  pq.enqueue('low', 3);
  pq.enqueue('high', 1);
  pq.enqueue('medium', 2);
  console.log(`   ✅ Dequeue: ${pq.dequeue()}`);
  console.log(`   ✅ Dequeue: ${pq.dequeue()}`);

  console.log('\n✅ All collections tests completed!');
}
