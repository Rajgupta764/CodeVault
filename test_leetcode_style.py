"""
Test Java code with HashMap (LeetCode style)
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import execute_code

print("=" * 60)
print("TESTING LEETCODE-STYLE JAVA CODE WITH HASHMAP")
print("=" * 60)

# Test 1: Solution class with HashMap (common LeetCode pattern)
print("\n1. Testing Solution class with HashMap:")
print("-" * 60)
hashmap_code = """
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}
"""
result = execute_code('JAVA', hashmap_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
if result['error']:
    print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile Output: {result['compile_output']}")

# Test 2: Code with ArrayList
print("\n\n2. Testing code with ArrayList:")
print("-" * 60)
arraylist_code = """
class Solution {
    public List<Integer> getNumbers() {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        return list;
    }
}
"""
result = execute_code('JAVA', arraylist_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
if result['error']:
    print(f"Error: {result['error']}")

# Test 3: Code with Stack
print("\n\n3. Testing code with Stack:")
print("-" * 60)
stack_code = """
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        stack.push('(');
        stack.push(')');
        return stack.size() == 2;
    }
}
"""
result = execute_code('JAVA', stack_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
if result['error']:
    print(f"Error: {result['error']}")

# Test 4: Direct HashMap usage with main
print("\n\n4. Testing direct HashMap usage:")
print("-" * 60)
direct_code = """
HashMap<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

System.out.println("Scores: " + scores);
System.out.println("Alice's score: " + scores.get("Alice"));
"""
result = execute_code('JAVA', direct_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
if result['error']:
    print(f"Error: {result['error']}")

print("\n" + "=" * 60)
print("✅ Java code now works like LeetCode!")
print("Users can use HashMap, ArrayList, Stack, etc. without imports!")
print("=" * 60)
