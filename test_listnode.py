"""
Test ListNode and helper classes in Java wrapper
Tests LeetCode-style problems with ListNode, TreeNode, etc.
"""
import os
import django
import sys

# Force UTF-8 output for Windows
if sys.platform == 'win32':
    os.environ['PYTHONIOENCODING'] = 'utf-8'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import execute_code, run_test_cases

print("=" * 70)
print("TESTING LISTNODE AND HELPER CLASSES IN JAVA WRAPPER")
print("=" * 70)

# Test 1: Simple ListNode usage
print("\n1. Testing simple ListNode compilation:")
print("-" * 70)
listnode_simple = """
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;
        
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }
        
        if (list1 != null) {
            current.next = list1;
        } else {
            current.next = list2;
        }
        
        return dummy.next;
    }
}
"""

result = execute_code('JAVA', listnode_simple)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile Output: {result['compile_output']}")
    print("❌ Compilation FAILED - ListNode not found!")
else:
    print("✅ Compilation SUCCESSFUL - ListNode class is available!")

# Test 2: TreeNode usage
print("\n\n2. Testing TreeNode compilation:")
print("-" * 70)
treenode_code = """
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return isMirror(root, root);
    }
    
    private boolean isMirror(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) return true;
        if (t1 == null || t2 == null) return false;
        return (t1.val == t2.val) && isMirror(t1.right, t2.left) && isMirror(t1.left, t2.right);
    }
}
"""

result = execute_code('JAVA', treenode_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile Output: {result['compile_output']}")
    print("❌ Compilation FAILED - TreeNode not found!")
else:
    print("✅ Compilation SUCCESSFUL - TreeNode class is available!")

# Test 3: Node (Graph) usage
print("\n\n3. Testing Node class (Graph) compilation:")
print("-" * 70)
graph_code = """
class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        
        Map<Node, Node> map = new HashMap<>();
        return dfs(node, map);
    }
    
    private Node dfs(Node node, Map<Node, Node> map) {
        if (map.containsKey(node)) return map.get(node);
        
        Node clone = new Node(node.val);
        map.put(node, clone);
        
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(dfs(neighbor, map));
        }
        
        return clone;
    }
}
"""

result = execute_code('JAVA', graph_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile Output: {result['compile_output']}")
    print("❌ Compilation FAILED - Node class not found!")
else:
    print("✅ Compilation SUCCESSFUL - Node class is available!")

# Test 4: Test case execution with ListNode
print("\n\n4. Testing test case execution with ListNode:")
print("-" * 70)
test_cases = [
    {
        "input": "[1,2,4]\n[1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Merge two sorted linked lists"
    }
]

merge_code = """
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;
        
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }
        
        if (list1 != null) {
            current.next = list1;
        } else {
            current.next = list2;
        }
        
        return dummy.next;
    }
}
"""

try:
    test_results = run_test_cases('JAVA', merge_code, test_cases)
    print(f"All Passed: {test_results['all_passed']}")
    print(f"Passed: {test_results['passed_count']}/{test_results['total_count']}")
    
    for result in test_results['results']:
        print(f"\nTest Case {result['test_case']}:")
        print(f"  Input: {result['input']}")
        print(f"  Expected: {result['expected']}")
        print(f"  Actual: {result['actual']}")
        print(f"  Status: {'✅ PASSED' if result['passed'] else '❌ FAILED'}")
        if result['error']:
            print(f"  Error: {result['error']}")
except Exception as e:
    print(f"❌ Error running test cases: {str(e)}")

print("\n" + "=" * 70)
print("TESTING COMPLETE!")
print("=" * 70)
