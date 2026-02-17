import {
  HashMap,
  HashSet,
  Queue,
  Stack,
  PriorityQueue,
  testCollections,
} from '../src/phase-10/collections';

describe('Phase 10: Collections & Data Structures', () => {
  // HashMap Tests
  describe('HashMap', () => {
    it('should set and get values', () => {
      const map = new HashMap<string, number>();
      map.set('alice', 30);
      map.set('bob', 25);
      expect(map.get('alice')).toBe(30);
      expect(map.get('bob')).toBe(25);
    });

    it('should check if key exists', () => {
      const map = new HashMap<string, string>();
      map.set('key1', 'value1');
      expect(map.has('key1')).toBe(true);
      expect(map.has('key2')).toBe(false);
    });

    it('should delete entries', () => {
      const map = new HashMap<string, number>();
      map.set('x', 10);
      expect(map.delete('x')).toBe(true);
      expect(map.has('x')).toBe(false);
    });

    it('should get all keys and values', () => {
      const map = new HashMap<string, number>();
      map.set('a', 1);
      map.set('b', 2);
      expect(map.keys().length).toBe(2);
      expect(map.values().length).toBe(2);
    });

    it('should filter entries', () => {
      const map = new HashMap<string, number>();
      map.set('a', 10);
      map.set('b', 20);
      map.set('c', 30);
      const filtered = map.filter((v) => v > 15);
      expect(filtered.size()).toBe(2);
    });

    it('should map values', () => {
      const map = new HashMap<string, number>();
      map.set('a', 1);
      map.set('b', 2);
      const doubled = map.map((v) => v * 2);
      expect(doubled.length).toBe(2);
      expect(doubled).toContain(2);
      expect(doubled).toContain(4);
    });
  });

  // HashSet Tests
  describe('HashSet', () => {
    it('should add and check membership', () => {
      const set = new HashSet<string>();
      set.add('a');
      set.add('b');
      expect(set.has('a')).toBe(true);
      expect(set.has('c')).toBe(false);
    });

    it('should prevent duplicates', () => {
      const set = new HashSet<string>();
      set.add('x');
      set.add('x');
      expect(set.size()).toBe(1);
    });

    it('should delete elements', () => {
      const set = new HashSet<number>();
      set.add(1);
      set.add(2);
      expect(set.delete(1)).toBe(true);
      expect(set.has(1)).toBe(false);
    });

    it('should compute union', () => {
      const set1 = new HashSet<string>();
      set1.add('a');
      set1.add('b');
      const set2 = new HashSet<string>();
      set2.add('b');
      set2.add('c');
      const union = set1.union(set2);
      expect(union.size()).toBe(3);
    });

    it('should compute intersection', () => {
      const set1 = new HashSet<number>();
      set1.add(1);
      set1.add(2);
      set1.add(3);
      const set2 = new HashSet<number>();
      set2.add(2);
      set2.add(3);
      set2.add(4);
      const inter = set1.intersection(set2);
      expect(inter.size()).toBe(2);
    });

    it('should compute difference', () => {
      const set1 = new HashSet<string>();
      set1.add('a');
      set1.add('b');
      set1.add('c');
      const set2 = new HashSet<string>();
      set2.add('b');
      const diff = set1.difference(set2);
      expect(diff.size()).toBe(2);
      expect(diff.has('a')).toBe(true);
    });
  });

  // Queue Tests
  describe('Queue (FIFO)', () => {
    it('should enqueue and dequeue in FIFO order', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
    });

    it('should peek without removing', () => {
      const queue = new Queue<string>();
      queue.enqueue('a');
      queue.enqueue('b');
      expect(queue.peek()).toBe('a');
      expect(queue.size()).toBe(2);
    });

    it('should return undefined on empty dequeue', () => {
      const queue = new Queue<number>();
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should check if empty', () => {
      const queue = new Queue<string>();
      expect(queue.isEmpty()).toBe(true);
      queue.enqueue('x');
      expect(queue.isEmpty()).toBe(false);
    });
  });

  // Stack Tests
  describe('Stack (LIFO)', () => {
    it('should push and pop in LIFO order', () => {
      const stack = new Stack<string>();
      stack.push('a');
      stack.push('b');
      stack.push('c');
      expect(stack.pop()).toBe('c');
      expect(stack.pop()).toBe('b');
    });

    it('should peek without removing', () => {
      const stack = new Stack<number>();
      stack.push(10);
      stack.push(20);
      expect(stack.peek()).toBe(20);
      expect(stack.size()).toBe(2);
    });

    it('should return undefined on empty pop', () => {
      const stack = new Stack<string>();
      expect(stack.pop()).toBeUndefined();
    });

    it('should convert to array', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      const arr = stack.toArray();
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  // PriorityQueue Tests
  describe('PriorityQueue', () => {
    it('should dequeue by priority (lower = higher priority)', () => {
      const pq = new PriorityQueue<string>();
      pq.enqueue('low', 3);
      pq.enqueue('high', 1);
      pq.enqueue('medium', 2);
      expect(pq.dequeue()).toBe('high');
      expect(pq.dequeue()).toBe('medium');
      expect(pq.dequeue()).toBe('low');
    });

    it('should peek highest priority element', () => {
      const pq = new PriorityQueue<number>();
      pq.enqueue(100, 2);
      pq.enqueue(50, 1);
      expect(pq.peek()).toBe(50);
    });

    it('should handle default priority (0)', () => {
      const pq = new PriorityQueue<string>();
      pq.enqueue('a');
      pq.enqueue('b', 1);
      expect(pq.dequeue()).toBe('a'); // priority 0 comes first
      expect(pq.dequeue()).toBe('b'); // priority 1 comes second
    });

    it('should maintain size correctly', () => {
      const pq = new PriorityQueue<string>();
      pq.enqueue('x', 1);
      pq.enqueue('y', 2);
      pq.enqueue('z', 3);
      expect(pq.size()).toBe(3);
      pq.dequeue();
      expect(pq.size()).toBe(2);
    });
  });

  // Integration test
  it('should run collection tests without errors', () => {
    expect(() => testCollections()).not.toThrow();
  });
});
